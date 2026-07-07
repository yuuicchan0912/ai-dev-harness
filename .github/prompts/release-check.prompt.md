---
mode: agent
description: ReleaseJudge 相当として全証跡を突合し completed/deployable/rejected/blocked を判定
---

# release-check

## 目的
証跡だけに基づいて出荷可否を判定する。**判定権限は ReleaseJudge 相当の最終判定役のみ。**
コード・テスト・証跡は修正しない。

## 入力（必須証跡・9 件。すべて `harness/evidence/<feature-id>/` 配下）
- `test.log` / `lint.log` / `typecheck.log` / `dependency-audit.log` / `ci-status.md` /
  `evaluator-report.md` / `security-report.md` / `pre-deploy-security-check.md` /
  `final-operation-check.md`

`release-decision.md` は**入力ではなく出力**（自己言及にしない）。

## 実行手順
1. 必須証跡 9 件の存在を確認する。1 つでも欠ければ blocked。
2. 各証跡を pass / fail / unknown で読む。証跡パスが空の項目は unknown。
3. 判定規則:
   - unknown が 1 つでもある → blocked
   - fail / blocker が 1 つでもある → rejected または blocked
   - 未解決の high セキュリティ指摘 → deployable 不可
   - テスト未実行 / CI 未確認 / SecurityReview 未完了 / 最終動作Check 未完了 → 禁止
   - 全 pass かつ DoD 充足 → completed / deployable

## 禁止事項
- コード / テスト / 証跡の修正。証跡以外（心証）での判定。推測。未選択 profile 参照。

## 出力フォーマット（`harness/evidence/<feature-id>/release-decision.md`）
- 判定: deployable / rejected / blocked（feature 完了は completed）
- 判定理由 / 確認した証跡ファイル（パス付き）/ 未確認項目（無しでも明記）
- blocker / major / minor の一覧 / deployable にできない場合の次アクション

## 参照先
`.claude/skills/release-check/SKILL.md`（正本）・`.claude/rules/70-completed-policy.md`。
