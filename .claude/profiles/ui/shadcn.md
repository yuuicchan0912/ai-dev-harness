# UI Profile: shadcn/ui

> このファイルは `.claude/active-profile.md` の `ui_profile:` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `ui_profile:` がこのファイル（`.claude/profiles/ui/shadcn.md`）を
指しているときのみ有効。指していない場合、この profile を Read / Grep / Bash / @参照 /
ファイル参照経由を問わず読んではならず、内容を実装・会話に反映してはならない。

## 前提frontend_profile

- 前提となる `frontend_profile` は `.claude/profiles/frontend/nextjs.md`（Next.js / App Router）。
- `ui_profile` 切替時は、この `前提frontend_profile` が現在の `frontend_profile` と一致することを
  確認する。不一致なら作業を `blocked` にして人間へエスカレーションする（`rules/10`）。

## 設計思想

- shadcn/ui は「配布物ではなくコピーして持つコンポーネント」。npm ライブラリとして抱えるのではなく、
  CLI で自リポジトリ内にソースを取り込み、プロジェクト側で保守する。
- スタイル基盤は TailwindCSS 前提。ユーティリティクラスとデザイントークンでスタイルを組む。
- MUI と同時採用しない。両者を混在させる必要が出た場合は、別途 hybrid profile を作る前提とし、
  この profile の対象外とする（初期版では hybrid を作らない）。

## 依存パッケージ

- TailwindCSS とその周辺（`tailwindcss` / PostCSS / `autoprefixer` 等）。
- shadcn/ui が生成するコンポーネントが依存するプリミティブ（Radix UI 等）と、
  `class-variance-authority` / `clsx` / `tailwind-merge` などのユーティリティ。
- `@mui/*` 系パッケージ・Emotion（MUI 用途）を追加しない。

## 初期化・セットアップコマンド

> 実行コマンド正本ではなく、UI ライブラリ固有の初期化のみ。Docker 前提のため `web` サービス上で実行する。

- shadcn/ui 初期化: `docker compose exec web npx shadcn@latest init`
  - 対話で `components.json` を生成する。エイリアス（`@/components` / `@/lib/utils` など）と
    Tailwind 設定・CSS variables 方針をここで固定する。
- コンポーネント追加: `docker compose exec web npx shadcn@latest add <component>`
  - 例: `docker compose exec web npx shadcn@latest add button`
- Tailwind 依存の導入が未了なら、frontend_profile / project-profile の規約に沿って
  `web` サービス上で追加する（ホスト直接実行はしない）。

## テーマ・スタイル方針

- デザイントークン（色・radius・spacing 等）は Tailwind config と CSS variables に寄せる。
  コンポーネント側にハードコードした色・寸法を散らさない。
- ダーク/ライトは CSS variables のトークン切替で扱う。
- `components.json` を使う場合は、そこで宣言したエイリアス・スタイル・トークン方針を単一の
  正とし、個別コンポーネントで方針を上書きしない。

## コンポーネント配置規約

- shadcn/ui CLI が生成する基盤コンポーネント: `src/components/ui/`
- ドメイン/機能単位のコンポーネント: `src/components/features/`
- 共通ユーティリティ（`cn` など）: `src/lib/utils.ts`
- 具体的なディレクトリ名がプロジェクトで異なる場合は project-profile の規約を優先する。

## フォーム・バリデーション方針

- フォームは shadcn/ui の Form コンポーネント（React Hook Form + スキーマバリデーション）を基本にする。
- バリデーションはクライアント表示用と割り切り、サーバ側（backend_profile）の境界検証を必須とする
  （クライアント検証だけに認可・整合性を依存しない）。
- 入力エラーは `aria-invalid` / エラーメッセージの関連付け（`aria-describedby`）で支援技術に伝える。

## アクセシビリティ方針

- UI 実装時はアクセシビリティ、keyboard 操作、`focus-visible`、aria 属性を確認する。
- Radix ベースのプリミティブが提供する role / aria / フォーカストラップを壊さない
  （独自 div で置き換えて意味付けを失わない）。
- 色のみに依存した状態表現をしない（コントラスト・テキスト/アイコン併記）。

## テスト方針

- テストの実行コマンドはこの profile で定義しない。選択中 `frontend_profile` の「テストコマンド」
  （コンポーネント/ユニット・E2E/スモーク）を参照する。
- shadcn/ui 固有の観点として、生成コンポーネントの role / aria、keyboard 操作、focus 可視性を
  テスト観点に含める。

## Storybook・カタログ方針

- カタログを使う場合は Storybook を基本とし、`src/components/ui/` と
  `src/components/features/` のコンポーネントを状態別に確認できるようにする。
- Storybook を導入する場合も、テスト/lint/型チェックの実行コマンド正本は frontend_profile を
  参照する（この profile に実行コマンドを増やさない）。

## Lint・format・型チェック方針

- Lint / format / 型チェックの実行コマンドはこの profile で定義しない。
- 選択中 `frontend_profile` の「Lint / 静的解析 / 型チェック」見出しの実行コマンドを参照する。
- Tailwind のクラス順序整形などを使う場合も、実行は frontend_profile / project-profile の
  規約に従い、コマンド正本をここに直書きしない。

## Docker・CIでの確認

- Docker / CI での確認は、選択中 `frontend_profile` と `docker_profile` に従う。
- この profile 独自の Docker / CI 手順やコマンドは定義しない。
- 「ローカルで緑 = CI で緑」を崩さないため、UI テストも `web` サービス上で実行する。

## 禁止事項

- MUI（`@mui/*`）系パッケージを追加しない。shadcn/ui と MUI を同時採用しない。
- テスト/lint/format/型チェックの実行コマンドをこの profile に直書きしない
  （frontend_profile の固定見出しを参照する）。
- 未選択 UI profile（例: `mui.md`）を読む・内容を反映することを禁止する。
- デザイントークンをコンポーネントに散らさない（Tailwind config / CSS variables に寄せる）。

## このprofile固有の注意点

- shadcn/ui はコピーして持つ設計のため、生成後のコンポーネントは自リポジトリのソースとして
  レビュー・保守対象になる。CLI 再生成で手直しを上書きしないよう差分を確認する。
- 同時採用が必要になった場合は hybrid profile を別途作る前提とし、この profile では扱わない。
