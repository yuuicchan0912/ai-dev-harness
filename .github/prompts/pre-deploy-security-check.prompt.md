---
mode: agent
description: デプロイ前 SecurityCheck を証跡ベースで行う（運用寄り）
---

# pre-deploy-security-check

## 目的
デプロイ直前に、コード・設定・Docker・CI・環境変数・secret・infra 固有リスクを実地確認する。
各観点をチェックリストで 1 項目ずつ機械的に消化する。コードは修正しない。

## 入力
- `<feature-id>`・active-profile の infra_profile / backend_profile
- `dependency-audit.log`・Dockerfile / docker-compose / CI 設定

## 実行手順（各項目を pass / fail / unknown で記録し、証跡パスを必ず添える）
1. secret がコード・設定・ログ・テストデータに混入していないか。
2. 認証漏れ / 認可漏れ / IDOR / 水平・垂直権限昇格。
3. 入力検証 / SQL Injection / XSS / CSRF / SSRF / Open Redirect / Path Traversal。
4. CORS / Cookie / Session / Security Header の設定妥当性。
5. backend_profile の「依存監査コマンド」が実行済みか。
6. Dockerfile / docker-compose / CI / 環境変数 / secret 管理の危険設定。
7. 選択中 infra_profile 固有のセキュリティ注意点。

## 禁止事項
- コード修正。推測での PASS（証跡パスが空なら自動 unknown）。deployable 判定。未選択 profile 参照。
- 未解決の high 指摘が 1 つでもあれば deployable にしない。

## 出力フォーマット
- チェックリスト（項目 / 状態 / 重大度 / 証跡パス）→
  `harness/evidence/<feature-id>/pre-deploy-security-check.md`。

## 参照先
`.claude/skills/pre-deploy-security-check/SKILL.md`（正本）・`docs/05_security_review.md`。
