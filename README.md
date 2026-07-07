# 共通開発ハーネス（Claude Code 用）

どの Web 開発プロジェクトにもコピーして使える Claude Code 用の共通開発ハーネスです。
ハーネス設計・ループエンジニアリング・TDD を標準化し、Planner → Generator → Evaluator →
SecurityReviewer → ReleaseJudge の開発フローを固定します。

## 特徴

- **active-profile 方式**: 有効な技術構成を `.claude/active-profile.md` の参照先だけで指定。
  未選択 profile は PreToolUse hook で読込ブロック。
- **技術切替**: フロントは Next.js 標準、バックエンドは Django / Go / Node.js / Laravel /
  Rails、インフラは AWS / GCP / Vercel+Supabase をポインタ書き換えで切替。
- **Docker 必須**: ローカル開発・テスト・CI テストジョブは Docker。デプロイランタイムは
  infra_profile に従う。
- **TDD 前提**: 契約 → RED → GREEN → REFACTOR → 評価 → 修正の状態遷移。
- **証跡ベース判定**: completed / deployable は ReleaseJudge のみが、証跡が揃ったときだけ判定。
- **デプロイ前チェック**: pre-deploy-security-check と final-operation-check を必須化。

## 前提

- **ホストに Node.js が必要**（PreToolUse hook `guard-active-profile-read.js` の実行用）。
  Node.js が無い環境では hook が動作せず、未選択 profile の読込ブロックが無効化される。
  アプリの開発・テスト・CI テストジョブは引き続き Docker 前提（ホストの言語ランタイム不要）。

## クイックスタート

1. `.claude/` `templates/` `docs/` `harness/` を対象リポジトリへコピーする
   （既存 `.claude/` がある場合は上書きせずマージ。`docs/07_project_adoption_guide.md` 参照）。
2. `templates/active-profile.md` を `.claude/active-profile.md` に置き、5 つのポインタを選ぶ。
3. `templates/project-profile.md` を `.claude/project-profile.md` にコピーして固有情報を記入。
4. `docs/08_profile_switching.md` の互換マトリクスで backend×infra が supported か確認する。
5. docker compose 構成を確認（無ければ最初の契約として作成）。
6. Claude Code に「有効な profile 構成を報告せよ」と聞き、未選択 profile が混ざらないことを確認。

## Codex 対応

このハーネスは Claude Code と Codex の両方で使えます。

- **Codex の主指示**: リポジトリルートの `AGENTS.md`。
- **Codex 用 skills**: `.agents/skills/`（`.claude/skills/` と同等の 11 skill）。
- **Codex 用設定**: `.codex/`（`config.toml` / hook / 有効化手順は `.codex/README.md`）。
- `.claude/active-profile.md`・`.claude/project-profile.md`・`.claude/rules/`・
  `.claude/profiles/`・`harness/contracts/`・`harness/evidence/` は
  **Claude Code / Codex の共通資産**であり、どちらのツールでも同じものを使います。

## docs 索引

- `docs/00_concept.md` — 思想と前提・制約
- `docs/01_harness_architecture.md` — 読み込み順序と各層の責務
- `docs/02_loop_engineering.md` — ループ状態遷移と blocked
- `docs/03_tdd.md` — TDD の組み込み方
- `docs/04_quality_gate.md` — 品質ゲートと CI 例
- `docs/05_security_review.md` — セキュリティ観点
- `docs/06_model_strategy.md` — Opus / Sonnet / Fable5 の使い分け
- `docs/07_project_adoption_guide.md` — 別プロジェクトへの適用手順
- `docs/08_profile_switching.md` — 切替手順と backend×infra 互換マトリクス

## 適用手順（5 ステップ要約）

コピー → active-profile 選択 → project-profile 記入 → 互換確認 → スモーク確認。
詳細は `docs/07_project_adoption_guide.md`。
