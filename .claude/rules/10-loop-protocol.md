# 10 — ループプロトコル

## 状態遷移

```
contract → red → green → refactor → evaluate → security → judge → completed
                                        ↑___ 差し戻し（red / green へ）
   いずれの状態からでも → blocked（人間の判断待ち）
   judge の結果 → completed / rejected / blocked
```

状態一覧: `contract` / `red` / `green` / `refactor` / `evaluate` / `security` /
`judge` / `completed` / `rejected` / `blocked`。

## 各状態の意味

- **contract**: feature-contract を作成・凍結する（Planner）。
- **red**: 契約のテスト観点表から失敗するテストを書き、失敗ログを証跡化する。
- **green**: テストを通す最小実装（1 イテレーション = 1 テスト観点が目安）。
- **refactor**: テスト緑のまま整理。ここでテストの expectation を書き換えない。
- **evaluate**: Evaluator が全テスト・静的解析・依存監査・契約突合を実行。
- **security**: SecurityReviewer がレビュー。デプロイ前は pre-deploy-security-check も実施。
- **judge**: ReleaseJudge が証跡だけで completed / deployable / rejected / blocked を判定。

## 1 イテレーションの上限

- 1 イテレーション = 1 テスト観点を目安にし、変更範囲を小さく保つ。
- 大きな変更が必要なら契約を分割して Planner に戻す。

## blocked への遷移条件

以下は推測で進めず `blocked` にし、人間へエスカレーションする。

- 同一エラーが 3 回連続で解消しない。
- active-profile.md の backend×infra 組合せが互換マトリクス上 invalid。
- 仕様の不明点・契約の穴で判断できない。
- CI 確認が環境的にできない（代替証跡も取れない）。
- 秘密情報の取り扱いなど、人間の承認が必要な操作。

blocked にしたら、理由・必要な判断・再開条件を明記して停止する。

## 外部ループ（/outer-loop。1 反復 = 最大 1 feature）

内部品質ループを反復実行する外部ループの規約。手順の正本は
`.claude/skills/outer-loop/SKILL.md`、設計と Claude Code 固有事項は
`docs/09_external_loop.md`。

- 1 反復で処理する feature は最大 1 件。同一反復で次の feature へ進まない。
- 外部ループの状態（idle / in-progress / blocked / stopped / done）は
  `harness/state/loop-state.md` に固定形式で記録する（コミットしない。
  形式は outer-loop skill / docs/09）。内部ループの状態一覧とは別物。
- 事前確認は次の順序を厳守する:
  1. `harness/state/loop-state.md` を最初に確認する。
  2. in-progress が無い場合: worktree が dirty なら stop、clean なら新規選択へ。
  3. in-progress がある場合: 現在 branch が loop-state の `branch:` と一致し、
     merge conflict がなく、同じ feature の作業途中と確認できれば **dirty でも再開可**。
  4. branch 不一致・merge conflict・由来不明の変更がある場合は stop。
  5. in-progress がある間は新しい feature を選択しない。
  6. stash / reset / checkout 等による自動退避・自動破棄は禁止。
- 対象選択の正本は sprint-contract（`harness/contracts/sprint-<id>.md`）とし、
  記載順で選ぶ。completed（release-decision.md）と blocked の feature は除外する。
  対象がなければ done（正常終了）。
- Git 操作:
  - commit は release-decision.md が completed かつ blocker / high 以上の未解消
    Security 指摘なしの場合のみ（実装・契約・証跡を同一 commit に含める）。
  - push / PR は project-profile の `outer_loop.push_allowed` / `pr_allowed` が
    true の場合のみ。PR 作成まで（merge しない）。
  - merge / deploy / force-push / branch 削除は自動化しない。
  - blocked 時は自動 commit しない（failure-report 単独の自動 commit も禁止。
    未コミット変更は branch 上に残す）。
- 再試行上限は本ファイルの「同一エラー 3 回」に一元化する（外部ループ用の
  別上限を作らない）。
- 契約の凍結（人間承認）と infra apply の承認は無人反復で代行しない。承認待ちは stop。
