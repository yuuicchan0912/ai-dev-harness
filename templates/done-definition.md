# done-definition（DoD 雛形）

feature-id: {{id}}

completed / deployable は ReleaseJudge のみが判定する。以下が全て満たされるまで禁止。

## チェックリスト（各項目に証跡パスを添える）
- [ ] 全テストが Docker 内で緑 — 証跡: `harness/evidence/{{id}}/test.log`
- [ ] Lint / 静的解析が緑 — 証跡: `harness/evidence/{{id}}/lint.log`
- [ ] 型チェックが緑 — 証跡: `harness/evidence/{{id}}/typecheck.log`
- [ ] 依存監査が実行済み・high 未解決なし — 証跡: `harness/evidence/{{id}}/dependency-audit.log`
- [ ] CI 緑を確認 — 証跡: `harness/evidence/{{id}}/ci-status.md`
- [ ] Evaluator レビュー完了 — 証跡: `harness/evidence/{{id}}/evaluator-report.md`
- [ ] SecurityReview 完了 — 証跡: `harness/evidence/{{id}}/security-report.md`
- [ ] デプロイ前 SecurityCheck 完了 — 証跡: `harness/evidence/{{id}}/pre-deploy-security-check.md`
- [ ] 最終動作 Check 完了 — 証跡: `harness/evidence/{{id}}/final-operation-check.md`
- [ ] RED 証跡あり — `harness/evidence/{{id}}/red.log`（テスト弱体化なし）
- [ ] docs / contract / project-profile 同期済み（`rules/60`）
- [ ] release-decision.md 作成済み — `harness/evidence/{{id}}/release-decision.md`

## 禁止（1 つでも該当なら completed / deployable 不可）
- テスト未実行 / CI 未確認 / SecurityReview 未完了 / 最終動作Check 未完了
- 証跡に unknown が 1 つでもある（→ blocked）
- 未解決の high セキュリティ指摘 / blocker
- テストの skip / todo で緑にしている
