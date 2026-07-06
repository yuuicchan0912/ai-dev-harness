# backend profile — Ruby on Rails

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `backend_profile` がこのファイルを指しているときのみ有効。

## 技術スタック

- Ruby + Ruby on Rails（API モードを標準とする）。

## ディレクトリ規約

- Rails 標準（`app/`, `config/`, `db/`）。詳細は project-profile。

## API契約の置き場所

- OpenAPI スキーマを `api/contract/` に置く。request spec / 契約テストで一致を確認する。

## 認証/認可方針

- 認証はミドルウェア / gem で統一。認可は Pundit / CanCan 等で操作単位に確認し IDOR を避ける。

## DB/ORM方針

- Active Record を使用。生 SQL はサニタイズ / プレースホルダを使う。

## Migrationコマンド

- `docker compose exec api bin/rails db:migrate`

## Seeder/Fixtureコマンド

- `docker compose exec api bin/rails db:seed`

## テストコマンド

- `docker compose exec api bin/rails test`（RSpec 構成では `bundle exec rspec`）。

## Lint/静的解析コマンド

- Lint: `docker compose exec api bundle exec rubocop`
- 静的解析: `docker compose exec api bundle exec rubocop`（型は sorbet 導入時に追加）。

## 依存監査コマンド

- `docker compose exec api bundle exec bundler-audit check --update`（または `bundle audit`）。
- 結果を `harness/evidence/<feature-id>/dependency-audit.log` に保存する。

## ローカル起動コマンド

- `docker compose up api`

## CIテストジョブ例

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build api
      - run: docker compose run --rm api bundle install
      - run: docker compose run --rm api bundle exec rubocop
      - run: docker compose run --rm api bin/rails db:migrate
      - run: docker compose run --rm api bin/rails test
      - run: docker compose run --rm api bundle exec bundler-audit check --update
```

## このスタック固有の禁止事項

- `secrets` / credentials をコミットしない。
- mass assignment を無防備に許可しない（strong parameters 必須）。
- Active Record の生 SQL 文字列連結を禁止（サニタイズ必須）。
