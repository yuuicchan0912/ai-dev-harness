# backend profile — PHP (Laravel)

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `backend_profile` がこのファイルを指しているときのみ有効。

## 技術スタック

- PHP + Laravel。API は Laravel のルーティング / コントローラで構成する。

## ディレクトリ規約

- Laravel 標準（`app/`, `routes/`, `database/`）。詳細は project-profile。

## API契約の置き場所

- OpenAPI スキーマを `api/contract/` に置く。契約テストで実装との一致を確認する。

## 認証/認可方針

- 認証は Laravel の Guard / Sanctum 等で統一。認可は Policy / Gate で操作単位に確認し
  IDOR を避ける。

## DB/ORM方針

- Eloquent を使用。生 SQL はバインディングでパラメータ化する。

## Migrationコマンド

- `docker compose exec api php artisan migrate`

## Seeder/Fixtureコマンド

- `docker compose exec api php artisan db:seed`

## テストコマンド

- `docker compose exec api php artisan test`（または `./vendor/bin/phpunit`）。

## Lint/静的解析コマンド

- Lint: `docker compose exec api ./vendor/bin/pint --test`
- 静的解析: `docker compose exec api ./vendor/bin/phpstan analyse`

## 依存監査コマンド

- `docker compose exec api composer audit`
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
      - run: docker compose run --rm api composer install
      - run: docker compose run --rm api ./vendor/bin/pint --test
      - run: docker compose run --rm api ./vendor/bin/phpstan analyse
      - run: docker compose run --rm api php artisan test
      - run: docker compose run --rm api composer audit
```

## このスタック固有の禁止事項

- `APP_DEBUG=true` を本番想定の設定に残さない。
- `.env` の秘密をコミットしない。
- Eloquent の raw 文字列連結を禁止（バインディング必須）。
