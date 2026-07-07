# 00 — コンセプト

## なぜハーネスか

ハーネスは「Claude Code が何を・どの順で読み、どう判断し、いつ完了とするか」を固定する層です。
コードそのものではなく、読み込み規約・ループ規約・品質ゲートを標準化することで、
どのプロジェクトでも同じ品質のフローを再現します。

## 3 層分離

- **共通層**: ルート直下の `CLAUDE.md`（Claude Code 主指示）と `.claude/rules/`。
  どの技術構成でも変わらない方針。Codex の主指示はルート直下の `AGENTS.md`。
- **選択層**: `.claude/profiles/`。技術選択ごとのルール。active-profile が指す 1 ファイルだけ有効。
- **プロジェクト層**: `.claude/project-profile.md`。固有情報の唯一の置き場。

ハーネス本体（rules / profiles / agents / skills / docs）には、固有プロジェクト名・DB名・
サービス名・個人情報を書きません。

## 中核となる約束

- 切替はポインタ書き換えのみ（コメントアウト切替は禁止）。
- 未選択 profile は読まない（hook で機械的にブロック）。
- TDD を状態遷移として強制する。
- completed / deployable は ReleaseJudge が証跡だけで判定する。
- Docker はローカル開発・テスト・CI で必須。デプロイランタイムは infra_profile に従う。

## 前提技術

- フロントエンド: Next.js（標準）。
- バックエンド: Django / Go / Node.js / PHP(Laravel) / Ruby on Rails から選択。
- インフラ: AWS / GCP / Vercel+Supabase から選択。

## 制約（初期版）

- **1 リポジトリ 1 バックエンド構成が前提**。モノレポで複数バックエンドを同時に扱う構成は
  初期版では非対応。複数バックエンドが必要な場合は、リポジトリを分けるか、将来版の
  マルチ profile 対応を待つ。
- 1 リリース = 1 feature-id を既定とする。複数 feature を束ねる場合は
  `harness/evidence/release/<release-id>/` 規約を使う（`rules/30`）。

## この設計が防ぐ失敗

- 未選択スタックの流儀混入（例: Django 選択時に別 backend のパターンが混ざる）。
- テスト未実行のまま「たぶん通る」で完了扱いにする。
- レビュー担当がコードを書き換えて評価が甘くなる。
- 実現不能な技術組合せで契約を書いてしまう。
