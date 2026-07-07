---
applyTo: "**"
---

# セキュリティ方針（Copilot 用）

- SecurityReview 必須。デプロイ前は PreDeploySecurityCheck も必須。
- 確認観点: secret 混入 / 認証 / 認可 / IDOR / 入力検証 / SQL Injection / XSS / CSRF /
  SSRF / Open Redirect / Path Traversal / CORS / Cookie / Session / Security Header。
- 依存監査コマンドは選択中の backend_profile の「依存監査コマンド」見出しを参照して実行し、
  結果を `harness/evidence/<feature-id>/dependency-audit.log` に保存する。
- **証跡なしで PASS にしない。** 証跡がない項目は unknown。未解決の high 指摘が 1 つでも
  あれば deployable 不可。

詳細: `.claude/rules/40-security-baseline.md`・`docs/05_security_review.md`。
