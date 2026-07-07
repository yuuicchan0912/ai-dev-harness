---
applyTo: "**"
---

# ハーネス全体方針（Copilot 用）

- 有効な技術構成は `.claude/active-profile.md` を正とする。列挙されていない
  `.claude/profiles/` 配下の profile は Read / Grep / Bash 経由を問わず読まない。
- 個別プロジェクト情報は `.claude/project-profile.md` にのみ書く。
- 凍結済み feature-contract は `harness/contracts/<feature-id>.md`、実行証跡は
  `harness/evidence/<feature-id>/` へ保存する。
- completed / deployable の最終判定は **ReleaseJudge 相当の最終判定役の専権**
  （`.claude/rules/70-completed-policy.md`）。証跡ベースで判定する。
- **blocker が 1 つでもあればコミット / デプロイ不可。**

詳細: `CLAUDE.md`・`AGENTS.md`・`.claude/rules/`。
