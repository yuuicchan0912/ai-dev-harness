#!/usr/bin/env node
/**
 * guard-active-profile-read.js (Codex edition)
 *
 * Same idea as .claude/hooks/guard-active-profile-read.js:
 * block reads of any profile under `.claude/profiles/` that is NOT listed
 * in `.claude/active-profile.md`, so unselected stacks never leak into
 * the agent context.
 *
 * The allowlist is built ONLY from `*_profile:` assignment lines in
 * active-profile.md. Candidate lists, comments and prose are ignored.
 * Path comparison is case-normalized (safe on case-insensitive filesystems).
 *
 * Because hook wiring differs across Codex versions, this script supports
 * two invocation modes:
 *
 *   1. Event mode (stdin JSON, same shape as Claude Code PreToolUse):
 *        echo '{"tool_name":"Read","tool_input":{"file_path":"..."}}' | node guard-active-profile-read.js
 *      -> prints a deny JSON and exits 0, or exits 0 silently to allow.
 *
 *   2. CLI mode (single path argument):
 *        node guard-active-profile-read.js .claude/profiles/backend/django.md
 *      -> exit 0 = allow, exit 2 = deny (reason on stderr).
 *
 * Known limitation (see .codex/README.md and AGENTS.md):
 * reads via Bash (`cat` / `sed` / `awk` ...) cannot be fully blocked by this
 * hook alone; AGENTS.md and .claude/rules/00-reading-order.md prohibit them.
 */

'use strict';

const fs = require('fs');
const path = require('path');

function projectDir() {
  return (
    process.env.CODEX_PROJECT_DIR ||
    process.env.CLAUDE_PROJECT_DIR ||
    process.cwd()
  );
}

function parseAllowedProfiles(root) {
  const apPath = path.join(root, '.claude', 'active-profile.md');
  let text;
  try {
    text = fs.readFileSync(apPath, 'utf8');
  } catch (_) {
    return null; // fail safe: caller denies profile reads
  }
  const allowed = new Set();
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
  return path.normalize(path.relative(root, abs));
}

function isInsideProfiles(rel) {
  if (!rel) return false;
  const r = rel.toLowerCase();
  const base = path.normalize('.claude/profiles').toLowerCase();
  return r === base || r.startsWith(base + path.sep);
}

/**
 * @returns {null|string} null = allow, string = deny reason
 */
function decide(root, target) {
  const rel = toRepoRelative(root, target);
  if (!isInsideProfiles(rel)) return null;

  const allowed = parseAllowedProfiles(root);
  if (allowed === null) {
    return (
      'Cannot read .claude/active-profile.md to verify the profile allowlist. ' +
      'Fix active-profile.md before reading profiles.'
    );
  }

  if (!rel.toLowerCase().endsWith('.md')) {
    return (
      `Blocked: "${rel}" is a directory under .claude/profiles/. ` +
      'Reading or searching it would pull in unselected profiles. ' +
      `Allowed: ${[...allowed].join(', ') || '(none listed)'}.`
    );
  }

  if (allowed.has(rel.toLowerCase())) return null;

  return (
    `Blocked: "${rel}" is not the active profile. ` +
    'Only profiles listed in .claude/active-profile.md may be read. ' +
    `Allowed: ${[...allowed].join(', ') || '(none listed)'}. ` +
    'To switch stacks, change the pointer in active-profile.md.'
  );
}

function main() {
  const root = projectDir();

  // CLI mode: single path argument.
  const argPath = process.argv[2];
  if (argPath) {
    const reason = decide(root, argPath);
    if (reason === null) process.exit(0);
    process.stderr.write(reason + '\n');
    process.exit(2);
  }

  // Event mode: stdin JSON (Claude Code PreToolUse shape).
  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (_) {
    process.exit(0);
  }
  let event;
  try {
    event = JSON.parse(raw);
  } catch (_) {
    process.exit(0);
  }
  const toolName = event.tool_name || event.toolName;
  if (toolName !== 'Read' && toolName !== 'Grep') process.exit(0);
  const input = event.tool_input || event.toolInput || {};
  const target = toolName === 'Read' ? input.file_path : input.path;
  if (!target) process.exit(0);

  const reason = decide(root, target);
  if (reason === null) process.exit(0);
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

main();
