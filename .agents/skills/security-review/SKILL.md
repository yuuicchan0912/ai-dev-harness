---
name: security-review
description: feature 単位のセキュリティ差分レビュー。observation を証跡付きで security-report にまとめる。コードは修正しない。
---

# security-review

## 目的
実装差分に対するセキュリティ観点レビューを行い、指摘を重大度付きで記録する。

## 入力
- feature-contract、`<feature-id>`、Evaluator 通過後の差分
- active-profile の infra_profile（固有注意点の参照元）、`dependency-audit.log`

## 実行手順
1. `docs/05_security_review.md` と `rules/40-security-baseline.md` の観点で差分を確認する。
2. 秘密情報混入 / 認証・認可 / IDOR / 入力検証 / SQLi / XSS / CSRF / SSRF / Open Redirect /
   Path Traversal / CORS / Cookie / Session / Security Header を 1 項目ずつ確認する。
3. 依存監査結果を確認する（未実行なら unknown）。
4. infra_profile 固有のセキュリティ注意点を確認する。
5. 各項目を pass / fail / unknown と重大度（high/medium/low）で記録する。

## 禁止事項
- コード修正。推測での pass（証跡なしは unknown）。completed 判定。未選択 profile 参照。

## 完了条件
- 全観点が判定済みで、証跡パスが埋まっている。

## 出力フォーマット
- security-report 本文（観点別 pass/fail/unknown、重大度、証跡パス、指摘の再現手順）。
  メインエージェントが `security-report.md` へ保存する。
