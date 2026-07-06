---
name: release-check
description: 全証跡と DoD を突合し、completed / deployable / rejected / blocked を判定して release-decision.md を作る。ReleaseJudge 専用。証跡のみで判定する。
---

# release-check

## 目的
証跡だけに基づいて出荷可否を判定する。判定権限は ReleaseJudge のみ。

## 入力
- `harness/evidence/<feature-id>/` の全証跡、feature-contract、done-definition

## 実行手順
1. 必須証跡の存在を確認する: test.log / lint.log / typecheck.log / dependency-audit.log /
   ci-status.md / evaluator-report.md / security-report.md / pre-deploy-security-check.md /
   final-operation-check.md。1 つでも欠ければ blocked。
2. 各証跡の状態を pass / fail / unknown で読む。証跡パスが空の項目は unknown。
3. 判定規則:
   - unknown が 1 つでもある → blocked
   - fail / blocker が 1 つでもある → rejected または blocked
   - 未解決の high セキュリティ指摘 → deployable 不可
   - テスト未実行 / CI 未確認 / SecurityReview 未完了 / 最終動作Check 未完了 → 禁止
   - 全 pass かつ DoD 充足 → completed / deployable
4. `release-decision.md` を出力する。これが存在しない限り completed は禁止。

## 禁止事項
- コード / テスト / 証跡内容の修正。証跡以外（心証）での判定。推測。未選択 profile 参照。

## 完了条件
- release-decision.md が全必須項目を含んで保存されている。

## 出力フォーマット（release-decision.md）
- 判定: deployable / rejected / blocked（feature 完了は completed）
- 判定理由 / 確認した証跡ファイル（パス付き） / 未確認項目（無しでも明記）
- blocker / major / minor の一覧 / deployable にできない場合の次アクション
