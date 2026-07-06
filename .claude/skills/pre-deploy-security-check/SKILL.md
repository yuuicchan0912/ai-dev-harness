---
name: pre-deploy-security-check
description: デプロイ前に SecurityReview より運用寄りの確認を行う。証跡がない項目は unknown。high 未解決なら deployable 不可。結果を pre-deploy-security-check.md に保存する。
---

# pre-deploy-security-check

## 目的
デプロイ直前に、コード・設定・Docker・CI・環境変数・secret・infra 固有リスクを実地確認する。
Fable5 不使用（Opus 実行）でも品質を保つため、チェックリストを 1 項目ずつ機械的に消化する。

## 入力
- `<feature-id>`、active-profile の infra_profile / backend_profile
- `dependency-audit.log`、Dockerfile / docker-compose / CI 設定

## 実行手順（各項目を pass / fail / unknown で記録し、証跡パスを必ず添える）
1. 秘密情報がコード・設定・ログ・テストデータに混入していないか。
2. 認証が必要な API に認証漏れがないか。
3. 認可が必要な操作に権限チェックがあるか（IDOR / 水平・垂直権限昇格）。
4. 入力値検証の不足はないか。
5. SQL Injection / XSS / CSRF / SSRF / Open Redirect / Path Traversal のリスク。
6. CORS / Cookie / Session / CSRF / Security Header の設定妥当性。
7. backend_profile の「依存監査コマンド」が実行済みか（`dependency-audit.log` を確認）。
8. Dockerfile / docker-compose / CI / 環境変数 / secret 管理の危険設定。
9. active-profile で選択中の infra_profile 固有のセキュリティ注意点。

## 共通制約
- 担当はコードを修正しない。推測で PASS にしない。
- 証跡パスが空の項目は自動 unknown。unknown があれば deployable にしない。
- 未解決の high 指摘が 1 つでもあれば deployable にしない。

## 禁止事項
- コード修正。推測 pass。deployable 判定（判定は ReleaseJudge）。未選択 profile 参照。

## 完了条件
- 全項目が pass / fail / unknown で埋まり、結果が保存されている。

## 出力フォーマット
- チェックリスト（項目 / 状態 / 重大度 / 証跡パス / 指摘）。メインエージェントが
  `harness/evidence/<feature-id>/pre-deploy-security-check.md` へ保存する。
