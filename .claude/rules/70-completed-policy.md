# 70 — completed / deployable ポリシー

## 判定権限

- completed / deployable / rejected / blocked の判定は **ReleaseJudge だけ**が行う。
- Generator / Evaluator / SecurityReviewer / メインエージェント / 人間の口頭指示は
  completed を宣言できない。
- ReleaseJudge は証跡だけに基づいて判定する。コードは修正しない。

## 2 段ゲート

- **completed（feature 単位）**: Evaluator + SecurityReviewer 通過後の feature 完了。
- **deployable（デプロイ単位）**: デプロイ直前の出荷可否。pre-deploy-security-check と
  final-operation-check を含む。completed でない feature を含むリリースは自動的に blocked。

## 必須証跡（これらが揃うまで completed / deployable は禁止）

```
harness/evidence/<feature-id>/test.log
harness/evidence/<feature-id>/lint.log
harness/evidence/<feature-id>/typecheck.log
harness/evidence/<feature-id>/dependency-audit.log
harness/evidence/<feature-id>/ci-status.md
harness/evidence/<feature-id>/evaluator-report.md
harness/evidence/<feature-id>/security-report.md
harness/evidence/<feature-id>/pre-deploy-security-check.md
harness/evidence/<feature-id>/final-operation-check.md
harness/evidence/<feature-id>/release-decision.md
```

`release-decision.md` が存在しない限り completed は禁止（`rules/30-quality-gate.md` と対で明記）。

## completed / deployable 禁止条件（1 つでも該当したら禁止）

- テスト未実行、または「たぶん通る」等の推測ベース報告。
- CI 未確認・CI 赤。
- SecurityReview 未完了、または未解決の high セキュリティ指摘が 1 つ以上。
- 最終動作 Check 未完了。
- DoD 未達項目あり。
- テストの弱体化 / skip / todo で緑にしている。
- 証跡に unknown が 1 つでもある（→ blocked）。
- blocker が 1 つでもある（→ deployable にしない）。
- ReleaseJudge 以外による completed / deployable 宣言。

## release-decision.md の必須記載

- 判定: deployable / rejected / blocked
- 判定理由
- 確認した証跡ファイル（パス付き）
- 未確認項目（無い場合も「無し」と明記）
- blocker / major / minor の一覧
- deployable にできない場合の次アクション
