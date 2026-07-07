---
mode: agent
description: Evaluator としてテスト・Lint・型・依存監査・契約突合を実行し report を出す
---

# evaluator-review

## 目的
品質ゲートを実行し、契約と実装の一致を証跡付きで確認する。コードは修正しない。

## 入力
- `harness/contracts/<feature-id>.md`・Generator の成果物・red.log / green.log
- active-profile が指す backend / frontend / testing profile

## 実行手順
1. 全テストを実行し `harness/evidence/<feature-id>/test.log` へ。
2. Lint / 静的解析 / 型チェックを実行し `lint.log` / `typecheck.log` へ。
3. backend_profile の「依存監査コマンド」を実行し `dependency-audit.log` へ。
4. RED 証跡の有無・テスト弱体化の有無を確認する。無ければ差し戻し。
5. API 契約・受け入れ条件と実装を突合する。未選択スタックの流儀混入も確認する。
6. 各項目を pass / fail / unknown と証跡パスで記録する。

## 禁止事項
- コード修正（指摘のみ）。completed / deployable 判定。推測での pass。未選択 profile 参照。

## 出力フォーマット
- `templates/review-report.md` 様式 → `harness/evidence/<feature-id>/evaluator-report.md`。

## 参照先
`.claude/skills/evaluator-review/SKILL.md`（正本）・`.claude/rules/30-quality-gate.md`。
