# backend profile — Django

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `backend_profile` がこのファイルを指しているときのみ有効。

## 技術スタック

- Python + Django（API は Django REST Framework を標準とする）。

## ディレクトリ規約

- Django アプリ単位でディレクトリを分ける。共通設定は `config/` 目安。詳細は project-profile。

## API契約の置き場所

- OpenAPI スキーマを `api/contract/`（または drf-spectacular 等の生成先）に置く。
- 契約と実装の一致はスキーマ生成 + 契約テストで確認する。

## 認証/認可方針

- 認証は DRF の認証クラスで統一。認可は permission クラス + オブジェクト単位で行い IDOR を避ける。

## DB/ORM方針

- Django ORM を使用。生 SQL は `params` でパラメータ化する。

## Migrationコマンド

- `docker compose exec api python manage.py migrate`

## Seeder/Fixtureコマンド

- `docker compose exec api python manage.py loaddata <fixture>`（fixture 名は project-profile）。

## テストコマンド

- `docker compose exec api pytest`（または `python manage.py test`）。

## Lint/静的解析コマンド

- Lint: `docker compose exec api ruff check .`
- 型チェック: `docker compose exec api mypy .`

## 依存監査コマンド

- `docker compose exec api pip-audit`（または `safety check`）。
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
      - run: docker compose run --rm api ruff check .
      - run: docker compose run --rm api mypy .
      - run: docker compose run --rm api pytest
      - run: docker compose run --rm api pip-audit
```

## このスタック固有の禁止事項

- `DEBUG=True` を本番想定の設定に残さない。
- `SECRET_KEY` などを設定ファイルにハードコードしない。
- QuerySet の生 SQL 文字列連結を禁止。
