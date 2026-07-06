# infra profile — GCP

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `infra_profile` がこのファイルを指しているときのみ有効。
常駐サーバ型 backend（django / go / laravel / rails / node）と supported。

## デプロイ単位

- コンテナ（Cloud Run / GKE）または関数（Cloud Functions）単位。project-profile で固定する。

## 実行環境

- 本番はマネージド実行環境（Cloud Run 等）。ローカル・テスト・CI は Docker（`rules/50`）。

## IaC/設定管理方針

- IaC ツールを 1 つに固定（Terraform 等、project-profile に明記）。
- 変更は infra-loop 経由で plan → 人間レビュー → apply。apply は人間承認必須。

## 環境規約

- dev / stg / prod をプロジェクトまたは環境で分離する。

## シークレット管理

- Secret Manager を使用。秘密をコード・イメージに焼き込まない。

## DB/ストレージ方針

- Cloud SQL 等のマネージド DB。GCS バケットの公開設定を明示管理する。

## CI/CD連携

- Cloud Build / GitHub Actions でビルド → テスト（Docker）→ 承認 → デプロイ。

## コスト管理方針

- ラベルで課金を可視化。Cloud Run の同時実行数・最大インスタンス数を管理する。

## 監視/ログ方針

- Cloud Logging / Monitoring を使用。秘密をログに出さない。

## 禁止操作

- IAM の過剰なロール付与（primitive roles の濫用）。
- GCS バケットの無自覚な公開（allUsers 付与）。
- 本番リソースの手動直接変更（IaC を経由する）。
