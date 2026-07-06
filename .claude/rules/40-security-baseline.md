# 40 — セキュリティ最低線（技術非依存）

技術に依存しないセキュリティの最低線。個別スタックの詳細は infra / backend profile に従う。

## 秘密情報

- 秘密情報（鍵・トークン・パスワード・接続情報）をコード・設定・ログ・テストデータ・
  コミットに含めない。
- 秘密は環境変数 / シークレットマネージャ経由で注入する。値そのものを profile や docs に
  書かない。
- クライアントに露出してよい値とサーバ限定の値を明確に分ける。

## 認証・認可

- 認証が必要な API に認証漏れがないこと。
- 認可が必要な操作に権限チェックがあること。
- IDOR・水平権限昇格・垂直権限昇格のリスクを確認する（他人のリソース ID で操作できない）。

## 入力検証

- すべての外部入力を信用しない。境界で検証・正規化する。
- SQL Injection / XSS / CSRF / SSRF / Open Redirect / Path Traversal を観点に含める。

## 依存脆弱性

- backend_profile の「依存監査コマンド」を実行し、結果を
  `harness/evidence/<feature-id>/dependency-audit.log` に保存する。
- high 以上の未解決脆弱性がある状態で deployable にしない。

## 設定

- CORS / Cookie / Session / CSRF / Security Header を妥当に設定する。
- Dockerfile / docker-compose / CI / 環境変数 / secret 管理に危険な設定を残さない。

詳細な運用寄りの確認は `docs/05_security_review.md` と
skill `security-review` / `pre-deploy-security-check` が担う。
