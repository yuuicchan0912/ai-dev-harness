# backend profile — Go

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `backend_profile` がこのファイルを指しているときのみ有効。

## 技術スタック

- Go（標準 net/http または軽量ルータ 1 つに固定。project-profile に明記）。

## ディレクトリ規約

- `cmd/` にエントリポイント、`internal/` にドメイン実装。詳細は project-profile。

## API契約の置き場所

- OpenAPI スキーマを `api/contract/` に置く。契約テストで実装との一致を確認する。

## 認証/認可方針

- 認証はミドルウェアで統一。認可はハンドラで操作単位に確認し IDOR を避ける。

## DB/ORM方針

- `database/sql` またはクエリビルダ / ORM を 1 つに固定。プレースホルダ必須。

## Migrationコマンド

- `docker compose exec api migrate up`（migrate ツールは project-profile に合わせる）。

## Seeder/Fixtureコマンド

- `docker compose exec api go run ./cmd/seed`

## テストコマンド

- `docker compose exec api go test ./...`

## Lint/静的解析コマンド

- Lint / 静的解析: `docker compose exec api golangci-lint run`
- 型チェック相当: `docker compose exec api go vet ./...`

## 依存監査コマンド

- `docker compose exec api govulncheck ./...`
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
      - run: docker compose run --rm api golangci-lint run
      - run: docker compose run --rm api go vet ./...
      - run: docker compose run --rm api go test ./...
      - run: docker compose run --rm api govulncheck ./...
```

## このスタック固有の禁止事項

- エラーの握りつぶし（`_ = err`）を禁止。
- SQL 文字列連結を禁止（プレースホルダ必須）。
- goroutine のリーク（キャンセル不能な起動）を放置しない。
