---
name: outer-loop
description: 外部ループの 1 反復（最大 1 feature）。loop-state 確認→対象選択→branch→/feature-cycle→ReleaseJudge 判定確認→Git 操作→continue/stop/done 記録。Claude Code の /loop から反復実行される。
---

# outer-loop

## 目的

内部品質ループ（`/feature-cycle`）を「1 反復 = 最大 1 feature」で実行する外部ループの手順。
`/loop` はスケジューラとしてのみ扱い、反復の中身はこの skill を正本とする
（設計・Claude Code 固有事項は `docs/09_external_loop.md`）。

## 入力

- `.claude/project-profile.md` の `outer_loop:` 設定
  （enabled / backlog_source / push_allowed / pr_allowed / branch_pattern）
- `harness/state/loop-state.md`（無ければ `status: idle` として固定形式で新規作成する）
- backlog 正本: `harness/contracts/sprint-<id>.md`（`backlog_source: sprint-contract`）
- `.claude/active-profile.md`、`harness/contracts/<feature-id>.md`、
  `harness/evidence/<feature-id>/`

## 事前確認（この順序を厳守する）

1. `harness/state/loop-state.md` を**最初に**確認する。
2. `status: in-progress` が**ない**場合:
   - worktree が dirty なら stop（由来不明の変更として blocked。人間へ）。
   - clean なら「対象選択」へ進む。
3. `status: in-progress` が**ある**場合:
   - 現在 branch が loop-state.md の `branch:` と一致するか確認する。
   - merge conflict がないか確認する。
   - 同じ feature の作業途中と確認できれば **dirty でも再開してよい**。
4. branch 不一致・merge conflict・由来不明の変更がある場合は stop（blocked）。
5. in-progress がある間は新しい feature を選択しない（再開のみ）。
6. stash / reset / checkout 等による自動退避・自動破棄は禁止。

## 実行手順

1. `outer_loop.enabled` が false（または未設定）なら実行せず、人間に有効化を依頼して stop。
2. 事前確認（上記の順序）を行う。
3. active-profile の互換性を確認する（invalid なら stop / blocked）。
4. 対象選択（in-progress が無い場合のみ）:
   - `backlog_source: sprint-contract` のみ対応。`harness/contracts/sprint-<id>.md` の
     記載順で先頭から選ぶ。
   - `harness/evidence/<feature-id>/release-decision.md` が completed の feature は除外する。
   - blocked の feature は除外する。
   - 対象がなければ **done** を loop-state.md に記録して終了する。
5. branch を `branch_pattern`（既定 `feature/<feature-id>`）で作成または再利用し、
   loop-state.md を `in-progress` に更新する。
6. 凍結済み feature-contract（`harness/contracts/<feature-id>.md`）を確認する。
   無ければ Planner に draft を作らせ、**人間承認待ちとして stop**する（無人凍結は禁止）。
7. `/feature-cycle` を実行する（内部品質ループ。Git 操作は行わせない）。
8. `harness/evidence/<feature-id>/release-decision.md` の判定を確認する
   （ReleaseJudge の出力だけを根拠にする）。
9. **completed かつ blocker / high 以上の未解消 Security 指摘なしの場合のみ** commit する。
   実装 + `harness/contracts/` + `harness/evidence/` を同一 commit に含める
   （secret はマスク済みであること。`rules/30` の証跡コミット方針に従う）。
10. push / PR は `outer_loop.push_allowed` / `pr_allowed` が true の場合のみ行う。
    PR 作成まで（merge はしない）。
11. 失敗・blocked 時:
    - feature-id 確定後なら `harness/evidence/<feature-id>/failure-report.md` に
      失敗内容・差分要約・blocked 理由・再開条件を記録する（secret は必ずマスクする）。
    - **blocked 時は自動 commit しない**。未コミット変更（failure-report を含む）は
      branch 上に残す。failure-report 単独の自動 commit も禁止。
      後に completed へ到達した場合、必要に応じて最終 commit へ含める。
    - feature-id 確定前の失敗は loop-state.md にのみ記録する。
12. loop-state.md に結果と continue / stop / done を記録して反復を終える。

## loop-state.md の固定形式（schema_version: 1）

```
# Loop State

schema_version: 1
status: idle | in-progress | blocked | stopped | done
backlog_source: sprint-contract
sprint_contract:
feature_id:
branch:
retry_count: 0
started_at:
updated_at:
last_result:
next_action:
```

- ローカル可変状態としてコミットしない（gitignore 済み。`.gitkeep` のみ追跡）。
- `status: in-progress` と `branch:` を二重処理防止・再開判定に使う。
  completed 判定には `release-decision.md` も併せて確認する。

## continue / stop / done

- **continue**: 反復は正常終了。次の反復で同一 feature の続き、または次対象を処理できる。
- **stop**: 人間の判断・承認が必要（blocked 理由と再開条件を loop-state.md と
  failure-report に明記する）。
- **done**: backlog に処理可能な対象がない（正常終了）。
- Claude Code の `/loop` 上では continue = 次反復へ、stop / done = ループ終了に対応する
  （スケジューラ制御は Claude Code 側の機能。`docs/09_external_loop.md`）。
  Codex では宣言の記録のみ行い、次の反復は人間が起動する。

## 禁止事項

- 1 反復で複数 feature を処理すること。in-progress 中の新規 feature 選択。
- ReleaseJudge の判定（release-decision.md）前の commit。
  completed / deployable の宣言（ReleaseJudge 専権。`rules/70`）。
- merge / deploy / force-push / branch 削除の自動実行。
- stash / reset / checkout 等による自動退避・自動破棄。
- blocked 時の自動 commit（failure-report 単独の自動 commit を含む）。
- sprint-contract 以外の backlog 選択ロジック（GitHub Issues 等は初期版非対応。
  `docs/09_external_loop.md` の将来拡張）。
- テスト弱体化、契約変更（Planner 経由のみ）、未選択 profile 参照。
- この skill の内部で `/loop` や再帰的な反復を起動すること（スケジューラは外側の
  `/loop` のみ）。

## 完了条件

- 1 反復の結果（continue / stop / done）が loop-state.md に固定形式で記録されている。
- commit した場合は、completed の release-decision.md と blocker / high なしが
  根拠として存在する。

## 出力フォーマット

- 反復サマリ: 選択した feature / branch / 実行した skills / ReleaseJudge 判定 /
  Git 操作の有無 / continue・stop・done / 次に処理予定の対象。
