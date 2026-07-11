---
name: feature-cycle
description: 凍結済み feature-contract 1 件を内部品質ループ（red→green→refactor→Evaluator→Security→final-operation-check→ReleaseJudge）で完走させるオーケストレーション。Git 操作は行わない（outer-loop の責務）。
---

# feature-cycle

## 目的

1 feature を既存の内部品質ループで contract 確認 → judge まで進める。
既存 skills / subagent を呼ぶだけで、各工程の手順の実体をこの skill に複製しない。

## 入力

- 凍結済み `harness/contracts/<feature-id>.md`、`<feature-id>`
- active-profile が指す profile（テスト / lint / 依存監査コマンドの参照元）
- `harness/evidence/<feature-id>/`（証跡の保存先）

## 実行手順

1. 凍結済み契約の存在を確認する。無ければ即座に stop を返す
   （契約の作成・凍結は outer-loop 側で Planner + 人間承認。無人凍結は禁止）。
2. **red**: `spec-to-tests` で失敗テスト群を作り、`red.log` を保存する。
3. **green / refactor**: Generator が `backend-api-loop` / `frontend-ui-loop` で
   1 観点ずつ進め、`green.log` を更新する（インフラ変更は `infra-loop`。ただし
   apply は人間承認必須のため、無人反復では blocked として stop する）。
4. **evaluate**: Evaluator subagent（`evaluator-review`）を実行し、
   `evaluator-report.md` を保存する。
5. **security**: SecurityReviewer subagent（`security-review` と
   `pre-deploy-security-check`）を実行し、証跡を保存する。
6. `final-operation-check` を実行し、`final-operation-check.md` を保存する。
7. **judge**: ReleaseJudge subagent（`release-check`）で `release-decision.md` を作る。
8. Evaluator / SecurityReviewer の差し戻しは、同一反復内で red / green に戻して
   再試行する。再試行上限は `rules/10` の「同一エラー 3 回で blocked」に従う
   （外部ループ用の別上限を作らない）。

## 禁止事項

- Git 操作（branch / commit / push / PR。すべて outer-loop の責務）。
- completed / deployable の宣言（ReleaseJudge 専権。`rules/70`）。
  release-decision.md の代筆・改変。
- 契約変更（Planner 経由のみ）。テスト弱体化・skip・todo。
- 証跡なしの pass 報告（証跡がない項目は unknown とする）。
- 未選択 profile 参照。ホスト直接実行（Docker 経由のみ。`rules/50`）。

## 完了条件

- `rules/70` の必須証跡が `harness/evidence/<feature-id>/` に揃い、
  release-decision.md が存在する。
- または blocked 理由（差し戻し上限・契約の穴・人間承認待ち等）と再開条件が
  明確に報告されている。

## 出力フォーマット

- 状態遷移の記録（red → … → judge）、作成した証跡パス一覧、ReleaseJudge 判定、
  差し戻し回数。blocked の場合は理由・必要な人間判断・再開条件。
