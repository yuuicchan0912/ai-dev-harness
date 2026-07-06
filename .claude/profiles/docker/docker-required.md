# docker profile — docker-required

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## 位置づけ

`rules/50-docker-baseline.md` の「原則」に対する「具体」。Docker はローカル開発・テスト・
CI テストジョブで必須。デプロイ先ランタイムは infra_profile に従い対象外。

## compose サービス命名規約

- `web`: フロントエンド（Next.js）。
- `api`: バックエンド（active な backend_profile のスタック）。
- `db`: データベース（infra / backend に応じて）。
- 追加サービスは役割ベースで命名する（`cache` / `queue` 等）。固有名詞は使わない。

## ボリューム方針

- ソースコードは開発時のみバインドマウントする。
- 依存物（node_modules / vendor 等）はコンテナ内に閉じ、ホストと共有しない。
- DB データは named volume で永続化する。

## コマンド実行方針

- 全テスト / lint / migration はコンテナ内で実行する（`docker compose exec <service> ...`）。
- ホストで言語ランタイムを直接呼ばない。

## compose が無いプロジェクト

- compose 構成が存在しない場合、Planner は最初の feature-contract として
 「開発環境のコンテナ化（web / api / db の compose 定義）」を切る。
- コンテナ化が完了するまで、他機能の TDD ループは開始しない。
