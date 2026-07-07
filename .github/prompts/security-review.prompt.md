---
mode: agent
description: SecurityReviewer として実装差分のセキュリティ観点を確認し report を出す
---

# security-review

## 目的
実装差分に対するセキュリティ観点レビューを行い、指摘を重大度付きで記録する。コードは修正しない。

## 入力
- `harness/contracts/<feature-id>.md`・Evaluator 通過後の差分
- active-profile が指す infra_profile・`dependency-audit.log`

## 実行手順
1. secret 混入 / 認証 / 認可 / IDOR / 入力検証 / SQL Injection / XSS / CSRF / SSRF /
   Open Redirect / Path Traversal / CORS / Cookie / Session / Security Header を確認する。
2. 依存監査結果を確認する（未実行なら unknown）。
3. 選択中 infra_profile 固有のセキュリティ注意点を確認する。
4. 各項目を pass / fail / unknown と重大度（high/medium/low）・証跡パスで記録する。

## 禁止事項
- コード修正。推測での pass（証跡なしは unknown）。completed / deployable 判定。未選択 profile 参照。

## 出力フォーマット
- `templates/review-report.md` 様式 → `harness/evidence/<feature-id>/security-report.md`。

## 参照先
`.claude/skills/security-review/SKILL.md`（正本）・`.claude/rules/40-security-baseline.md`・
`docs/05_security_review.md`。
