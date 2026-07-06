# infra profile — AWS

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `infra_profile` がこのファイルを指しているときのみ有効。
常駐サーバ型 backend（django / go / laravel / rails / node）と supported。

## デプロイ単位

- コンテナ（ECS / EKS）または関数（Lambda）単位。project-profile で 1 つに固定する。

## 実行環境

- 本番はコンテナ / サーバレスのマネージド実行環境。ローカル・テスト・CI は Docker（`rules/50`）。

## IaC/設定管理方針

- IaC ツールを 1 つに固定（Terraform / CDK 等、project-profile に明記）。
- 変更は infra-loop 経由で plan → 人間レビュー → apply。apply は人間承認必須。

## 環境規約

- dev / stg / prod をアカウントまたは環境で分離する。

## シークレット管理

- Secrets Manager / Parameter Store を使用。秘密をコード・イメージに焼き込まない。

## DB/ストレージ方針

- RDS 等のマネージド DB。S3 のバケット公開設定を明示管理する。

## CI/CD連携

- GitHub Actions 等でビルド → テスト（Docker）→ 承認 → デプロイ。

## コスト管理方針

- タグ付けで課金を可視化。オートスケール上限とアイドルリソースを管理する。

## 監視/ログ方針

- CloudWatch でメトリクス / ログを収集。秘密をログに出さない。

## 禁止操作

- IAM のワイルドカード全権付与。
- S3 バケットの無自覚な公開。
- 本番リソースの手動直接変更（IaC を経由する）。
