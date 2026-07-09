# 08 — profile 切替と互換マトリクス

## 切替方式

- 切替は `.claude/active-profile.md` の該当ポインタ 1 行を書き換えるだけ。
- コメントアウトで複数構成を残さない（コメントアウト切替は禁止）。
- 未選択 profile は読まない（`rules/00` + PreToolUse hook）。

## 切替手順

1. active-profile.md の `backend_profile` / `infra_profile` / `ui_profile` の参照先を変更する。
2. 下の互換マトリクスで組合せが `supported` か確認する。
3. docker compose 構成が新スタックに対応しているか確認する。
4. スモークテスト（コンテナ起動 + テスト 1 本）を実行する。
5. `.claude/project-profile.md` の依存記述（環境変数名など）を更新する。

## ui_profile の切替（shadcn/ui ⇄ MUI）

- 切替対象に `ui_profile` を含む。デフォルト UI profile は shadcn/ui。
- MUI を使う場合は `ui_profile:` を `.claude/profiles/ui/mui.md` へ変更する。
  shadcn/ui に戻す場合は `.claude/profiles/ui/shadcn.md` へ変更する。
- **shadcn→MUI / MUI→shadcn の切替は単純な行置換だけで済むとは限らない。**
  既存コンポーネント・theme・CSS・依存関係・テストを確認し、移行が必要な範囲を洗い出す。
- 切替時は feature-contract を作り、UI ライブラリ移行作業として扱う（その場で置換しない）。
- 同一 feature 内で shadcn/ui と MUI を混在させない（同時採用は原則禁止。必要なら
  hybrid profile を別途用意する）。
- `ui_profile` 切替時は、切替先 UI profile の `前提frontend_profile` が現在の
  `frontend_profile` と一致することを確認する。不一致なら `blocked` にして人間へ
  エスカレーションする。
- 切替後はコンテナ起動と UI テスト 1 本以上のスモークを行い、選択中 `ui_profile` だけが
  参照されることを確認する。

## backend × infra 互換マトリクス

分類: `supported`（推奨）/ `caution`（要注意・制約付き）/ `unsupported`（初期版非対応）。

- Node.js + Vercel+Supabase: **supported**
- Node.js + AWS: **supported**
- Node.js + GCP: **supported**
- Django + AWS: **supported**
- Django + GCP: **supported**
- Django + Vercel+Supabase: **unsupported**（常駐サーバ型のため Vercel マネージドに不適）
- Go + AWS: **supported**
- Go + GCP: **supported**
- Go + Vercel+Supabase: **unsupported**
- Laravel + AWS: **supported**
- Laravel + GCP: **supported**
- Laravel + Vercel+Supabase: **unsupported**
- Rails + AWS: **supported**
- Rails + GCP: **supported**
- Rails + Vercel+Supabase: **unsupported**

補足: Vercel+Supabase は Next.js の Route Handlers / サーバレス関数（Node.js）と組むのが標準。
常駐サーバ型 backend を Vercel+Supabase で動かしたい場合は、API のホスト先を別途用意する
必要があり、初期版のスコープ外（必要なら caution として個別に契約で扱う）。

## Planner の互換検証（必須の最初の工程）

Planner は作業開始時に、active-profile の backend×infra 組合せを上のマトリクスで検証する。
`unsupported`（または解決策のない `caution`）なら、作業を `blocked` にして人間へ profile 修正を
依頼し、実現不能な契約を書かない。

## PreToolUse hook の役割と限界

- hook（`.claude/hooks/guard-active-profile-read.js`）は `Read` / `Grep` による
  `.claude/profiles/` 配下の読込を、active-profile.md の許可リストと突合してブロックする。
  許可リストは active-profile.md の `*_profile:` 行だけから抽出する（候補一覧や説明文中の
  パスは対象外）。
- ディレクトリ指定の Grep（未選択 profile へ波及）も拒否する。
- 限界: repo ルートを対象にした Grep は広すぎるため hook ではブロックしない。この場合は
  `rules/00` の行動規約で未選択 profile を反映しないことを担保する。
- 限界: Bash 経由の `cat` / `sed` / `awk` などによる直接読込は、この hook だけでは完全には
  防げない。そのため `rules/00-reading-order.md` と各 agent の禁止事項でも、Bash を使って
  未選択 profile を読まないことを明記する。evaluator / security-reviewer は Bash を
  テスト実行・検査の用途に限定し、ファイル変更や未選択 profile の読込に使ってはならない。
