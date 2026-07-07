# GEMINI.md — Gemini CLI 用主指示（共通開発ハーネス）

このリポジトリは **Claude Code / Codex / GitHub Copilot / Gemini CLI の 4 ツールで使える
共通開発ハーネス**です。Gemini CLI で作業するときは以下を最優先で守ってください。詳細規約は
`CLAUDE.md`・`AGENTS.md`・`.github/copilot-instructions.md`・`.claude/rules/` にあり、
本ファイルと矛盾しません（共通資産）。

## 1. 技術構成の読み込み（絶対規約）

- 有効な技術構成は `.claude/active-profile.md` を**正**とする。
- `.claude/active-profile.md` に列挙されていない `.claude/profiles/` 配下の profile を
  **読んではならない**。
- **Read / Grep / Bash（`cat` / `sed` / `awk` 等）/ ファイル参照（@ 参照含む）経由を問わず**、
  未選択 profile を参照すること・内容を実装や会話に反映することを禁止する。
- **Gemini CLI にはこの構成では未選択 profile 読込防止 hook を同梱しない**
  （Claude Code / Codex は hook を持つ）。したがって未選択 profile 読込禁止は
  **行動規約として厳守する**。防御レベルが他系統より低いことを認識して運用する。
- スタック切替は active-profile.md のポインタ書き換えのみ（コメントアウト切替禁止）。

## 2. 情報の置き場所

- 個別プロジェクト情報は `.claude/project-profile.md` **だけ**に書く。
- 凍結済み feature-contract は `harness/contracts/<feature-id>.md` へ保存する。
- 実行証跡は `harness/evidence/<feature-id>/` へ保存する。

## 3. 開発フロー

- Planner → Generator → Evaluator → SecurityReviewer → ReleaseJudge の順で進める。
- TDD 必須: 失敗するテスト（RED 証跡 `red.log`）なしに実装しない。テストの弱体化・skip で
  緑にしない（`.claude/rules/20-tdd-protocol.md`）。
- ループ状態: contract / red / green / refactor / evaluate / security / judge /
  completed / rejected / blocked。同一エラー3回・仕様不明・CI 確認不能は blocked にして人間へ。

## 4. Docker

- **ローカル開発・テスト・CI テストジョブは Docker 必須**。テスト / lint / migration は
  選択中 profile の固定見出しに定義された `docker compose exec ...` を使う。
- デプロイ先ランタイムは選択中の infra_profile に従う（Docker 要件の対象外）。

## 5. completed / deployable 判定（証跡ベース）

- 判定は**証跡ベース**で行う。推測で PASS にしない。証跡がない項目は unknown とし、
  unknown が 1 つでもあれば blocked。
- **completed / deployable の最終判定は ReleaseJudge 相当の最終判定役の専権**とする
  （`.claude/rules/70-completed-policy.md`）。
- 以下の場合は completed / deployable **禁止**: テスト未実行 / CI 未確認 /
  SecurityReview 未完了 / PreDeploySecurityCheck 未完了 / FinalOperationCheck 未完了。
- **blocker が 1 つでもあればコミット / デプロイ不可**。未解決の high セキュリティ指摘が
  1 つでもあれば deployable 不可。

## 6. Gemini CLI 用コマンド

- 手動実行できるカスタムコマンドは `.gemini/commands/`（`.claude/skills/` を正本とする複製系）。
- コマンドは技術固有コマンドを直接書かず、選択中 profile の固定見出しを参照する。

## 参照先

`CLAUDE.md`・`AGENTS.md`・`.github/copilot-instructions.md`・`.claude/rules/`・
`.claude/active-profile.md`・`.claude/project-profile.md`。
