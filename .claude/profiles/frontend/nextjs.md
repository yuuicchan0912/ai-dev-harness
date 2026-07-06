# frontend profile — Next.js

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## 技術スタック

- Next.js（App Router 前提）。React。
- 型は TypeScript を標準とする。

## ディレクトリ規約

- App Router のルーティングは `app/` 配下。
- 再利用コンポーネントは `components/`、ドメインロジックは `lib/` を目安にする（詳細は
  project-profile の規約に従う）。

## サーバー / クライアントコンポーネント規約

- デフォルトはサーバーコンポーネント。ブラウザ API / 状態 / イベントが必要な箇所だけ
  `"use client"` を付ける。
- 秘密情報・サーバ専用ロジックをクライアントコンポーネントに持ち込まない。
- 公開してよい環境変数のみ `NEXT_PUBLIC_` を付ける。それ以外はサーバ側限定。

## テストコマンド（Docker 経由）

- コンポーネント / ユニット: `docker compose exec web npm test`
- E2E / スモーク: `docker compose exec web npm run test:e2e`
（package の実コマンド名は project-profile に合わせる。ホスト直接実行は禁止。）

## Lint / 静的解析 / 型チェック（Docker 経由）

- Lint: `docker compose exec web npm run lint`
- 型チェック: `docker compose exec web npm run typecheck`

## ローカル起動コマンド

- `docker compose up web`（依存サービスは compose 全体で起動）。

## この技術固有の禁止事項

- サーバ専用の秘密をクライアントバンドルに含めない。
- App Router と Pages Router を混在させない（初期版は App Router 前提）。
- データ取得の認可チェックをクライアント側だけに依存しない。
