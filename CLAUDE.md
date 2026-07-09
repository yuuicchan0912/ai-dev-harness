# CLAUDE.md — 共通開発ハーネス方針

このリポジトリは、どの Web 開発プロジェクトにもコピーして使える Claude Code 用の
共通開発ハーネスです。以下の方針を最優先で守ってください。

## 1. 読み込み順序（絶対規約）

1. このファイル `CLAUDE.md`（リポジトリルート）
2. `.claude/active-profile.md`
3. `.claude/project-profile.md`（プロジェクト固有情報の唯一の置き場）
4. `.claude/rules/`
5. `.claude/active-profile.md` で指定された profile **のみ**
   （frontend / ui / backend / infra / docker / testing）
   UI ライブラリは `ui_profile:` で選択する（デフォルト shadcn/ui、MUI は明示切替。
   同時採用は原則禁止）。読み込むのは `ui_profile:` が指す 1 ファイルのみ。

`.claude/profiles/` 配下で active-profile.md に列挙されていないファイルを
**Read も Grep もしてはならず、内容を会話・実装に反映してはならない**。
これは PreToolUse hook（`.claude/hooks/guard-active-profile-read.js`）でも機械的に
ブロックされる。詳細は `.claude/rules/00-reading-order.md`。

## 2. 開発フロー（固定）

Planner → Generator → Evaluator → SecurityReviewer → ReleaseJudge。
各段の責務・ツール権限・禁止事項は `.claude/agents/` の subagent 定義に従う。
判断に迷ったら実装せず Planner に戻る。仕様変更はその場で直さず契約（feature-contract）を
更新してから進む。

## 3. TDD 必須

失敗するテスト（RED 証跡）なしに実装コードを書かない。テストの弱体化・skip で緑にしない。
テスト変更が正当なのは契約変更（Planner 経由）のときだけ。詳細は `.claude/rules/20-tdd-protocol.md`。

## 4. Docker 必須

ローカル開発・テスト・CI のテストジョブは Docker 前提。全コマンドは
`docker compose exec <service> ...` 形式で profile に定義されたものを使う。
デプロイ先ランタイムは infra_profile に従い、Docker 要件の対象外。詳細は `.claude/rules/50-docker-baseline.md`。

## 5. completed / deployable 判定は ReleaseJudge のみ

Generator / Evaluator / SecurityReviewer / メインエージェントは completed も deployable も
宣言できない。`harness/evidence/<feature-id>/release-decision.md` が存在し、必要な証跡が
すべて揃うまで completed は禁止。詳細は `.claude/rules/70-completed-policy.md`。

## 6. プロジェクト固有情報

固有情報は `.claude/project-profile.md` にのみ読み書きする。rules / profiles / agents /
skills / docs には固有名詞・DB名・サービス名・個人情報を書かない。

## 7. 迷ったら

不明点・仕様の穴・互換マトリクス invalid・CI 確認不能・同一エラー3回は、
推測で進めず状態を `blocked` にして人間へエスカレーションする（`.claude/rules/10-loop-protocol.md`）。
