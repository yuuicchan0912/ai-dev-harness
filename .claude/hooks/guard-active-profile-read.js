#!/usr/bin/env node
/**
 * guard-active-profile-read.js
 *
 * PreToolUse hook for Read / Grep.
 *
 * Purpose:
 *   Prevent Claude Code from reading or grepping any profile under
 *   `.claude/profiles/` that is NOT listed in `.claude/active-profile.md`.
 *   This keeps the content of unselected backend / infra / frontend profiles
 *   out of the model context, so an unselected stack's rules can never be
 *   applied by accident.
 *
 * Contract:
 *   - Reads the PreToolUse event JSON from stdin.
 *   - Allows anything that does not target `.claude/profiles/`.
 *   - For targets inside `.claude/profiles/`:
 *       * a specific `.md` file that is listed in active-profile.md  -> allow
 *       * a specific `.md` file that is NOT listed                    -> deny
 *       * a directory (would fan out into unselected profiles)        -> deny
 *   - Denies with a clear reason so the model self-corrects.
 *
 * Known limitation (documented in docs/08_profile_switching.md):
 *   A Grep whose `path` is the repo root (not `.claude/profiles/`) is not
 *   blocked here, because blocking all root searches would be too broad.
 *   The reading-order rule (rules/00) covers that case behaviorally.
 */

'use strict';

const fs = require('fs');
const path = require('path');

function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch (_) {
    return '';
  }
}

function projectDir() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function allow() {
  // No output + exit 0 == allow (defer to normal permission flow).
  process.exit(0);
}

function deny(reason) {
  const out = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

function parseAllowedProfiles(root) {
  const apPath = path.join(root, '.claude', 'active-profile.md');
  let text;
  try {
    text = fs.readFileSync(apPath, 'utf8');
  } catch (_) {
    // If we cannot read the active profile, fail safe: block profile reads.
    return null;
  }
  const allowed = new Set();
  // Only lines that assign a profile pointer are authoritative. This excludes
  // the "選択肢" candidate list, comments and prose, so a candidate path can
  // never leak into the allowlist (e.g. when templates/active-profile.md is
  // copied verbatim). Paths are lowercased so the guard is not bypassable on
  // case-insensitive filesystems (macOS / Windows).
  const pathRe = /\.claude\/profiles\/[^\s`'"]+\.md/g;
  for (const line of text.split(/\r?\n/)) {
    if (!/^\s*[a-z_]+_profile:/.test(line)) continue;
    let m;
    while ((m = pathRe.exec(line)) !== null) {
      allowed.add(path.normalize(m[0]).toLowerCase());
    }
    pathRe.lastIndex = 0;
  }
  return allowed;
}

function toRepoRelative(root, target) {
  if (!target) return null;
  const abs = path.isAbsolute(target) ? target : path.join(root, target);
  const rel = path.relative(root, abs);
  return path.normalize(rel);
}

function isInsideProfiles(rel) {
  if (!rel) return false;
  // Case-insensitive so `.claude/Profiles/...` cannot slip past on
  // case-insensitive filesystems.
  const r = rel.toLowerCase();
  const base = path.normalize('.claude/profiles').toLowerCase();
  return r === base || r.startsWith(base + path.sep);
}

function main() {
  // CLI mode (parity with .codex/hooks): `node guard-active-profile-read.js <path>`
  // -> exit 0 = allow, exit 2 = deny (reason on stderr). Lets the guard be
  // smoke-tested without crafting a stdin event.
  const argPath = process.argv[2];
  if (argPath) {
    const cliRoot = projectDir();
    const cliRel = toRepoRelative(cliRoot, argPath);
    if (!isInsideProfiles(cliRel)) process.exit(0);
    const cliAllowed = parseAllowedProfiles(cliRoot);
    if (
      cliAllowed !== null &&
      cliRel.toLowerCase().endsWith('.md') &&
      cliAllowed.has(cliRel.toLowerCase())
    ) {
      process.exit(0);
    }
    process.stderr.write(
      `Blocked: "${cliRel}" is not the active profile (see .claude/active-profile.md).\n`
    );
    process.exit(2);
  }

  const raw = readStdin();
  let event;
  try {
    event = JSON.parse(raw);
  } catch (_) {
    allow(); // Not our concern if we cannot parse the event.
  }

  const toolName = event.tool_name || event.toolName;
  if (toolName !== 'Read' && toolName !== 'Grep') allow();

  const input = event.tool_input || event.toolInput || {};
  const root = projectDir();

  // Read -> file_path ; Grep -> path (search root)
  const target = toolName === 'Read' ? input.file_path : input.path;

  // Grep without an explicit path searches the cwd; treat as out of scope
  // for this guard (see "Known limitation" above).
  if (!target) allow();

  const rel = toRepoRelative(root, target);
  if (!isInsideProfiles(rel)) allow();

  const allowed = parseAllowedProfiles(root);
  if (allowed === null) {
    deny(
      'Cannot read .claude/active-profile.md to verify the profile allowlist. ' +
        'Fix active-profile.md before reading profiles.'
    );
  }

  const endsWithMd = rel.toLowerCase().endsWith('.md');

  if (!endsWithMd) {
    deny(
      `Blocked: "${rel}" is a directory under .claude/profiles/. ` +
        'Reading or grepping it would pull in unselected profiles. ' +
        'Target a single profile file listed in .claude/active-profile.md instead. ' +
        `Allowed: ${[...allowed].join(', ') || '(none listed)'}.`
    );
  }

  if (allowed.has(rel.toLowerCase())) allow();

  deny(
    `Blocked: "${rel}" is not the active profile. ` +
      'Only profiles listed in .claude/active-profile.md may be read. ' +
      `Allowed: ${[...allowed].join(', ') || '(none listed)'}. ` +
      'If you need to switch stacks, change the pointer in active-profile.md (never read the file directly).'
  );
}

main();
