# UI Profile: MUI

> このファイルは `.claude/active-profile.md` の `ui_profile:` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `ui_profile:` がこのファイル（`.claude/profiles/ui/mui.md`）を
指しているときのみ有効。指していない場合、この profile を Read / Grep / Bash / @参照 /
ファイル参照経由を問わず読んではならず、内容を実装・会話に反映してはならない。

## 前提frontend_profile

- 前提となる `frontend_profile` は `.claude/profiles/frontend/nextjs.md`（Next.js / App Router）。
- `ui_profile` 切替時は、この `前提frontend_profile` が現在の `frontend_profile` と一致することを
  確認する。不一致なら作業を `blocked` にして人間へエスカレーションする（`rules/10`）。

## 設計思想

- MUI（Material UI）はコンポーネントライブラリとして依存に持ち、テーマで一元的に見た目を制御する。
- Next.js App Router 統合を前提とし、Emotion のスタイルエンジンと Server Components の
  制約に沿って構成する。
- shadcn/ui と同時採用しない。両者を混在させる必要が出た場合は、別途 hybrid profile を作る前提とし、
  この profile の対象外とする（初期版では hybrid を作らない）。

## 依存パッケージ

- `@mui/material` と peer の Emotion（`@emotion/react` / `@emotion/styled`）。
- アイコンを使う場合は `@mui/icons-material`。
- Next.js App Router 統合パッケージ（`@mui/material-nextjs` 等）で SSR/キャッシュ連携を行う。
- shadcn/ui・Tailwind ベースの UI 基盤（`src/components/ui/` の shadcn 生成物や Tailwind の
  UI 用途導入）を追加しない。

## 初期化・セットアップコマンド

> 実行コマンド正本ではなく、UI ライブラリ固有の初期化のみ。Docker 前提のため `web` サービス上で実行する。

- 依存追加: `docker compose exec web npm install @mui/material @emotion/react @emotion/styled`
- Next.js 統合パッケージ: `docker compose exec web npm install @mui/material-nextjs @emotion/cache`
- アイコンが必要な場合: `docker compose exec web npm install @mui/icons-material`
- インストール後、下記「テーマ・スタイル方針」に従い ThemeProvider と App Router 用の
  cache provider を配置する（実行コマンド正本は増やさない）。

## テーマ・スタイル方針

- デザイントークン（palette・typography・spacing・shape 等）は MUI theme に寄せる。
  個別コンポーネントに色・寸法をハードコードしない。
- テーマ定義は `src/theme/` に置き、`createTheme` で単一の正を作る。
- `ThemeProvider`（および `CssBaseline`）はルートレイアウトに配置し、全体に一貫適用する。
- ダーク/ライトは theme の `palette.mode` で切り替える。

## コンポーネント配置規約

- 基盤/ラップコンポーネント（MUI をラップした共通 UI）: `src/components/ui/`
- ドメイン/機能単位のコンポーネント: `src/components/features/`
- テーマ定義（`createTheme` の設定・パレット・タイポグラフィ）: `src/theme/`
- 具体的なディレクトリ名がプロジェクトで異なる場合は project-profile の規約を優先する。

## フォーム・バリデーション方針

- フォームは MUI の入力コンポーネント（`TextField` 等）を基本にし、状態管理は
  React Hook Form 等と組み合わせる。
- バリデーションはクライアント表示用と割り切り、サーバ側（backend_profile）の境界検証を必須とする
  （クライアント検証だけに認可・整合性を依存しない）。
- 入力エラーは `error` prop と `helperText`、`aria-describedby` 等で支援技術に伝える。

## アクセシビリティ方針

- UI 実装時はアクセシビリティ、keyboard 操作、aria 属性を確認する。
- MUI コンポーネントが提供する role / aria / フォーカス管理を壊さない
  （`component` 差し替えで意味付けを失わない）。
- 色のみに依存した状態表現をしない（コントラスト・テキスト/アイコン併記）。

## テスト方針

- テストの実行コマンドはこの profile で定義しない。選択中 `frontend_profile` の「テストコマンド」
  （コンポーネント/ユニット・E2E/スモーク）を参照する。
- MUI 固有の観点として、テーマ適用（ThemeProvider 配下でのレンダリング）、role / aria、
  keyboard 操作をテスト観点に含める。

## Storybook・カタログ方針

- カタログを使う場合は Storybook を基本とし、ThemeProvider でラップした状態で
  `src/components/ui/` と `src/components/features/` を状態別に確認できるようにする。
- Storybook を導入する場合も、テスト/lint/型チェックの実行コマンド正本は frontend_profile を
  参照する（この profile に実行コマンドを増やさない）。

## Lint・format・型チェック方針

- Lint / format / 型チェックの実行コマンドはこの profile で定義しない。
- 選択中 `frontend_profile` の「Lint / 静的解析 / 型チェック」見出しの実行コマンドを参照する。
- 実行は frontend_profile / project-profile の規約に従い、コマンド正本をここに直書きしない。

## Docker・CIでの確認

- Docker / CI での確認は、選択中 `frontend_profile` と `docker_profile` に従う。
- この profile 独自の Docker / CI 手順やコマンドは定義しない。
- 「ローカルで緑 = CI で緑」を崩さないため、UI テストも `web` サービス上で実行する。

## 禁止事項

- shadcn/ui・Tailwind ベースの UI 基盤を追加しない。MUI と shadcn/ui を同時採用しない。
- テスト/lint/format/型チェックの実行コマンドをこの profile に直書きしない
  （frontend_profile の固定見出しを参照する）。
- 未選択 UI profile（例: `shadcn.md`）を読む・内容を反映することを禁止する。
- デザイントークンをコンポーネントに散らさない（MUI theme に寄せる）。

## このprofile固有の注意点

- App Router では Emotion のスタイル注入順が SSR で崩れやすい。`@mui/material-nextjs` の
  App Router 用 cache provider（`AppRouterCacheProvider` 等）をルートレイアウトに配置し、
  スタイルの二重挿入・FOUC を避ける。
- `"use client"` 境界に注意する。MUI のインタラクティブコンポーネントはクライアント側で扱い、
  Server Components に持ち込まない。
- 同時採用が必要になった場合は hybrid profile を別途作る前提とし、この profile では扱わない。
