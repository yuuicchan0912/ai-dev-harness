# AGENTS.md — Codex 用主指示（共通開発ハーネス）

このリポジトリは **複数の AI コーディングツール（Claude Code / Codex / GitHub Copilot /
Gemini CLI）で使える共通開発ハーネス**です。
以下の規約は Codex で作業するときの最優先指示です。詳細規約は `.claude/rules/` にあり、
本ファイルと矛盾しません（共通資産）。

## 1. 技術構成の読み込み（絶対規約）

- 有効な技術構成は `.claude/active-profile.md` で指定される。
- `.claude/active-profile.md` に列挙されていない `.claude/profiles/` 配下の profile を
  **読んではならない**。
- **Read / Grep / Bash（`cat` / `sed` / `awk` 等）経由を問わず**、未選択 profile を参照する
  こと・内容を実装や会話に反映することを禁止する。
- ガード hook は `.codex/hooks/guard-active-profile-read.js`（有効化は `.codex/README.md`）。
  hook が無効な環境でも本規約は変わらない。
- スタック切替は active-profile.md のポインタ書き換えのみ（コメントアウト切替禁止）。

## 2. 情報の置き場所

- 個別プロジェクト情報は `.claude/project-profile.md` **だけ**に書く。
  ハーネス本体（rules / profiles / skills / docs）に固有名詞・DB名・個人情報を書かない。
- 凍結済み feature-contract は `harness/contracts/<feature-id>.md` へ保存する。
- 実行証跡は `harness/evidence/<feature-id>/` へ保存する（固定ファイル名は
  `.claude/rules/30-quality-gate.md`）。

## 3. 開発フロー

- Planner → Generator → Evaluator → SecurityReviewer → ReleaseJudge の順で進める
  （各責務と禁止事項は `.claude/agents/` の定義に準拠する）。
- TDD 必須: 失敗するテスト（RED 証跡 `red.log`）なしに実装しない。テストの弱体化・skip で
  緑にしない（`.claude/rules/20-tdd-protocol.md`）。
- ループ状態: contract / red / green / refactor / evaluate / security / judge /
  completed / rejected / blocked（`.claude/rules/10-loop-protocol.md`）。
  同一エラー3回・仕様不明・CI 確認不能は blocked にして人間へ。

## 4. Docker

- **ローカル開発・テスト・CI テストジョブは Docker 必須**。テスト / lint / migration は
  profile に定義された `docker compose exec ...` 形式で実行する。
- デプロイ先ランタイムは選択中の infra_profile に従う（Docker 要件の対象外）。

## 5. completed / deployable 判定（証跡ベース）

- completed / deployable の最終判定は ReleaseJudge（または Codex 上の最終判定役）の
  専権とし、`.claude/rules/70-completed-policy.md` に従う。
- 判定は**証跡ベース**で行う。推測で PASS にしない。証跡がない項目は unknown とし、
  unknown が 1 つでもあれば blocked。
- 以下の場合は completed / deployable **禁止**:
  - テスト未実行
  - CI 未確認
  - SecurityReview 未完了
  - PreDeploySecurityCheck（`pre-deploy-security-check.md`）未完了
  - FinalOperationCheck（`final-operation-check.md`）未完了
  - DoD 未達 / release-decision.md 不在
- **blocker が 1 つでもあればコミット / デプロイ不可**。
  未解決の high セキュリティ指摘が 1 つでもあれば deployable 不可。

## 6. Codex 用 skills

- Codex で使う skills は `.agents/skills/` に置かれている（13 skill。
  `.claude/skills/` と同等の内容）。
- 外部ループ用 skill（`outer-loop` / `feature-cycle`）は、Codex では自動反復せず
  **1 反復ずつ手動で実行**する（自動反復は Claude Code の `/loop` 固有機能。
  `docs/09_external_loop.md`）。
- skill には技術固有コマンドを直接書かない。必ず `.claude/active-profile.md` で指定された
  profile の該当見出し（「テストコマンド」「依存監査コマンド」等）を参照する。
