# backend profile — Node.js

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `backend_profile` がこのファイルを指しているときのみ有効。

## 技術スタック

- Node.js（TypeScript 推奨）。Web フレームワークは 1 つに固定する（project-profile に明記）。
- Vercel + Supabase 構成では、API を Next.js の Route Handlers / サーバレス関数として置く構成が標準。

## ディレクトリ規約

- アプリコードは `api/`（または Next.js 同居時は `app/api/`）。
- ドメインロジックは `lib/` / `services/`。詳細は project-profile に従う。

## API契約の置き場所

- OpenAPI / スキーマ定義を `api/contract/`（または feature-contract 記載のパス）に置く。
- 契約と実装の一致は契約テスト or スキーマ検証で確認する。

## 認証/認可方針

- 認証は各リクエストで検証する。Supabase 併用時は RLS とアプリ層認可を二重で持つ。
- 認可は操作単位でチェックし、IDOR を避ける。

## DB/ORM方針

- ORM / クエリビルダを 1 つに固定する。生 SQL はパラメータ化必須。

## Migrationコマンド

- `docker compose exec api npm run migrate`（実コマンド名は project-profile に合わせる）。

## Seeder/Fixtureコマンド

- `docker compose exec api npm run seed`

## テストコマンド

- `docker compose exec api npm test`

## Lint/静的解析コマンド

- Lint: `docker compose exec api npm run lint`
- 型チェック: `docker compose exec api npm run typecheck`

## 依存監査コマンド

- `docker compose exec api npm audit`（pnpm 構成では `pnpm audit`）。
- 結果を `harness/evidence/<feature-id>/dependency-audit.log` に保存する。

## ローカル起動コマンド

- `docker compose up api`

## CIテストジョブ例

```yaml
# .github/workflows/ci.yml（テストジョブ抜粋）
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build api
      - run: docker compose run --rm api npm ci
      - run: docker compose run --rm api npm run lint
      - run: docker compose run --rm api npm run typecheck
      - run: docker compose run --rm api npm test
      - run: docker compose run --rm api npm audit
```

## このスタック固有の禁止事項

- 秘密を `NEXT_PUBLIC_` で露出しない。
- サーバレス前提の構成で、状態をメモリに保持する設計にしない。
- 生 SQL の文字列連結を禁止（パラメータ化必須）。

## api サービスが無い構成での読み替え

- Node.js + Vercel + Supabase 構成では、API が Next.js Route Handlers に統合される場合がある。
  その場合、compose に独立した `api` サービスが存在しないことがある。
- このとき、本 profile の `docker compose exec api ...` はプロジェクト構成に応じて
  `docker compose exec web ...` へ読み替える。
- 読み替え内容（どのコマンドをどのサービスで実行するか）は `.claude/project-profile.md` に
  明記する。
