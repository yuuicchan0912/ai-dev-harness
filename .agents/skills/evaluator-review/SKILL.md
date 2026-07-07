---
name: evaluator-review
description: Docker 内で全テスト・静的解析・依存監査を実行し、契約と突合して review-report を作る。コードは修正しない。
---

# evaluator-review

## 目的
品質ゲートを実行し、契約と実装の一致を証跡付きで確認する。

## 入力
- feature-contract、`<feature-id>`、Generator 成果物、red.log / green.log
- active-profile の backend / frontend / testing profile

## 実行手順
1. 全テストを実行し `test.log` へ保存。
2. Lint / 静的解析 / 型チェックを実行し `lint.log` / `typecheck.log` へ。
3. backend_profile の「依存監査コマンド」を実行し `dependency-audit.log` へ。
4. RED 証跡の有無、テスト弱体化 / skip / todo の有無を確認する。
5. API 契約・受け入れ条件と実装を突合する。
6. 未選択スタックの流儀混入を確認する。
7. `templates/review-report.md` 様式で結果を出力する（各項目 pass/fail/unknown + 証跡パス）。

## 禁止事項
- コード修正。completed 判定。推測での pass（証跡なしは unknown）。未選択 profile 参照。

## 完了条件
- 全ゲートの実行ログが保存され、review-report が出力されている。

## 出力フォーマット
- review-report 本文（対象 / 実行コマンドとログ要約 / 指摘 blocker·major·minor + 再現手順 / 判定）。
  メインエージェントが `evaluator-report.md` へ保存する。
