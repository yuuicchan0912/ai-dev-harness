# GitHub Copilot 用リポジトリ指示（共通開発ハーネス）

このリポジトリは **Claude Code / Codex / GitHub Copilot の 3 ツールで使える共通開発
ハーネス**です。GitHub Copilot で作業するときは以下を最優先で守ってください。詳細規約は
`CLAUDE.md`・`AGENTS.md`・`.claude/rules/` にあり、本ファイルと矛盾しません。

## 技術構成の読み込み（絶対規約）

- 有効な技術構成は `.claude/active-profile.md` を**正**とする。
- `.claude/active-profile.md` に列挙されていない `.claude/profiles/` 配下の profile を
  **読んではならない**。
- **Read / Grep / Bash（`cat` / `sed` / `awk` 等）経由を問わず**、未選択 profile を参照する
  こと・内容を実装や会話に反映することを禁止する。
- スタック切替は active-profile.md のポインタ書き換えのみ（コメントアウト切替禁止）。

## 情報の置き場所

- 個別プロジェクト情報は `.claude/project-profile.md` **だけ**に書く。
- 凍結済み feature-contract は `harness/contracts/<feature-id>.md` へ保存する。
- 実行証跡は `harness/evidence/<feature-id>/` へ保存する。

## Docker

- **ローカル開発・テスト・CI テストジョブは Docker 必須**。テスト / lint / migration は
  選択中 profile の固定見出しに定義された `docker compose exec ...` を使う。
- デプロイ先ランタイムは選択中の infra_profile に従う（Docker 要件の対象外）。

## completed / deployable 判定（証跡ベース）

- 判定は**証跡ベース**で行う。推測で PASS にしない。証跡がない項目は unknown とし、
  unknown が 1 つでもあれば blocked。
- **completed / deployable の最終判定は ReleaseJudge 相当の最終判定役の専権**とする
  （`.claude/rules/70-completed-policy.md`）。
- 以下の場合は completed / deployable **禁止**: テスト未実行 / CI 未確認 /
  SecurityReview 未完了 / PreDeploySecurityCheck 未完了 / FinalOperationCheck 未完了。
- **blocker が 1 つでもあればコミット / デプロイ不可**。未解決の high セキュリティ指摘が
  1 つでもあれば deployable 不可。

## 参照先

詳細は `CLAUDE.md`・`AGENTS.md`・`.claude/rules/`・`.claude/active-profile.md`・
`.claude/project-profile.md` を参照する。用途別指示は `.github/instructions/`、
手動実行プロンプトは `.github/prompts/`、カスタムエージェントは `.github/agents/`。
