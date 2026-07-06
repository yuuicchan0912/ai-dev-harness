# 05 — セキュリティレビュー

`rules/40-security-baseline.md` が最低線の正本。ここでは観点と 2 種類のレビューの役割を示します。

## 2 種類のレビュー

- **security-review（feature 単位）**: 実装差分に対する観点レビュー。security-report を出す。
- **pre-deploy-security-check（デプロイ単位）**: 運用寄りの最終確認。設定・Docker・CI・
  infra 固有リスクまで見る。pre-deploy-security-check.md を出す。

いずれも担当はコードを修正しない。推測で PASS にしない。証跡がなければ unknown / blocked。

## 観点（両レビューの共通チェック）

- 秘密情報がコード・設定・ログ・テストデータに混入していないか。
- 認証が必要な API に認証漏れがないか。
- 認可が必要な操作に権限チェックがあるか（IDOR / 水平・垂直権限昇格）。
- 入力値検証の不足はないか。
- SQL Injection / XSS / CSRF / SSRF / Open Redirect / Path Traversal のリスク。
- CORS / Cookie / Session / CSRF / Security Header の設定妥当性。
- 依存監査コマンドが実行済みか（`dependency-audit.log`）。
- Dockerfile / docker-compose / CI / 環境変数 / secret 管理の危険設定。
- active-profile で選択中の infra_profile 固有のセキュリティ注意点。

## infra 固有の注意点（選択中の 1 つだけ確認する）

- Vercel + Supabase: `service_role` キーのクライアント露出、RLS の有効化、`NEXT_PUBLIC_` の
  露出範囲、環境スコープの分離。
- AWS: IAM のワイルドカード全権、S3 バケットの公開設定、Secrets Manager の利用。
- GCP: 過剰な IAM ロール、GCS の allUsers 公開、Secret Manager の利用。

infra_profile の「シークレット管理」「禁止操作」見出しに具体が記載されています。

## 判定への影響

- 未解決の high 指摘が 1 つでもあれば deployable にしない。
- 依存監査未実行は unknown。unknown があれば blocked。
- 重大度は high / medium / low で記録し、report に証跡パスを添える。
