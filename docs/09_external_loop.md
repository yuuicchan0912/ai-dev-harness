# 09 — 外部ループ（/loop × /outer-loop）

## 目的

既存の内部品質ループ（Planner → Generator → Evaluator → SecurityReviewer → ReleaseJudge）を、
Claude Code の `/loop` から反復実行する外部ループで包む。`/loop` は**スケジューラとしてのみ**
扱い、反復の中身（1 反復 = 最大 1 feature）は skill を正本とする。

## 二層構造

```
/loop /outer-loop                  ← driver（Claude Code 固有。self-paced 推奨）
  └─ /outer-loop（skill）          ← wrapper: 1 反復 = 最大 1 feature
     ├─ 事前確認（loop-state → dirty 判定 → 再開 or 新規選択）
     ├─ 対象選択（sprint-contract の記載順）
     ├─ branch 作成 / 再利用
     ├─ /feature-cycle（skill）    ← 内部品質ループのオーケストレータ
     │    contract 確認 → red → green → refactor → evaluate → security
     │    → final-operation-check → judge（ReleaseJudge）
     ├─ Git 操作（completed のときのみ commit。push / PR は許可制）
     └─ continue / stop / done を loop-state に記録
```

## 基本原則

- 1 回の `/outer-loop` で処理する feature は最大 1 件。同一反復で次の feature へ進まない。
- 内部品質ループは既存の agents / skills をそのまま再利用する（新規 agent は作らない）。
- TDD・証跡・completed / deployable 判定の規約は一切緩めない。
  completed / deployable の最終判定は ReleaseJudge のみ（`rules/70`）。
- blocker または high 以上の未解消 Security 指摘があれば commit / PR 不可。
- merge / deploy / force-push / branch 削除は自動化しない。
- stash / reset / checkout 等による自動退避・自動破棄は禁止。

## 正本の所在（重複させない）

| 内容 | 正本 |
| --- | --- |
| 反復手順（1 反復の定義） | `.claude/skills/outer-loop/SKILL.md` |
| 内部ループのオーケストレーション | `.claude/skills/feature-cycle/SKILL.md` |
| ループ規約・Git 可否条件 | `.claude/rules/10-loop-protocol.md` の外部ループ節 |
| 証跡規約（failure-report 含む） | `.claude/rules/30-quality-gate.md` |
| プロジェクト別設定（`outer_loop:`） | `.claude/project-profile.md` |
| bare `/loop` の入口 | `.claude/loop.md`（`/outer-loop` へのポインタのみ。手順を書かない） |

## project-profile の設定（初期値 = 外部ループ無効）

```yaml
outer_loop:
  enabled: false
  backlog_source: sprint-contract
  push_allowed: false
  pr_allowed: false
  branch_pattern: feature/<feature-id>
```

`enabled: false` の間、`/outer-loop` は実行せず人間に有効化を依頼して stop する。
push / PR の既定は不許可（= 人間承認が必要な操作として扱う）。

## 対象選択（初期版）

- 正式対応する `backlog_source` は **sprint-contract のみ**。
- `harness/contracts/sprint-<id>.md` を正本とし、**記載順**で選択する（決定的順序）。
- `harness/evidence/<feature-id>/release-decision.md` が completed の feature は除外する。
- blocked の feature は除外する。
- loop-state が in-progress の間は新規選択しない（再開のみ）。
- 対象がなければ **done**（正常終了）。

## loop-state.md（固定形式 schema_version: 1）

`harness/state/loop-state.md` に以下の固定形式で記録する。

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

- ローカル可変状態として **gitignore する**（`harness/state/.gitkeep` のみ追跡）。
- `status: in-progress` と `branch:` を二重処理防止・再開判定に使う。
  completed 判定には `release-decision.md` も併せて確認する。

## failure-report.md

- **feature-id 確定後の失敗時のみ**作成する。保存先は
  `harness/evidence/<feature-id>/failure-report.md`（`rules/30` の証跡リスト参照）。
- feature-id 確定前の失敗（対象なし・dirty worktree・profile 非互換等）は
  loop-state.md にのみ記録する。
- **blocked 時には自動 commit しない**。branch 上の未コミット変更として残す。
  failure-report 単独の自動 commit は禁止。
- secret は必ずマスクする。
- 後に completed へ到達した場合、必要に応じて最終 commit へ含める。

## 停止条件

以下は反復を stop（blocked）または done で終える。推測で先へ進めない。

| 条件 | 結果 |
| --- | --- |
| backlog に処理可能な対象がない | done |
| in-progress なしで worktree が dirty | stop |
| branch 不一致・merge conflict・由来不明の変更 | stop |
| active-profile が互換マトリクス上 invalid | stop |
| feature-contract が未凍結・不完全（人間承認待ち） | stop |
| blocker あり / high 以上の未解消 Security 指摘 | stop（commit / PR 不可） |
| 必須証跡不足・unknown あり | stop（`rules/70`） |
| CI 未確認（代替証跡も取れない） | stop |
| 同一エラー 3 回（`rules/10`） | stop |
| push / PR が許可されていない等の権限不足 | stop（許可済み範囲までで終了） |
| infra apply 等、人間承認が必要な操作 | stop |

## Claude Code 固有部分

このセクションの内容は Claude Code のみに適用される（他ツールへ複製しない）。

- **起動**: `/loop /outer-loop` を標準とする（間隔省略の self-paced 推奨。反復の所要時間が
  可変のため）。固定間隔なら `/loop 30m /outer-loop`。bare `/loop` は `.claude/loop.md`
  経由で同じ 1 反復を実行する（loop.md はポインタのみ。プロンプト指定時は無視される）。
- **バージョン要件**:
  - `/loop` / scheduled tasks: Claude Code **v2.1.72 以降**。
  - **v2.1.196 以降**、scheduled task から実行する skill に
    `disable-model-invocation: true` を付けてはならない（付けると skill が実行されず
    プレーンテキスト扱いになる）。`outer-loop` / `feature-cycle` の frontmatter は
    `name` / `description` のみとする。
  - self-paced loop の `stop: true`（モデル自身によるループ終了）: **v2.1.202 以降**。
- **セッションスコープ**: `/loop` のタスクは現在のセッションに属する。新規会話で消滅し、
  `--resume` / `--continue` では未失効タスクが復元される。
- **停止**: 次反復の待機中に `Esc` で停止できる。self-paced ではモデルが `stop: true` で
  終了できる（done / stop 宣言に対応）。
- **期限**: 反復タスクは作成から **7 日で自動失効**する。長期運用は失効前に再作成するか、
  Routines / Desktop scheduled tasks 等の永続スケジューラを使う。
- **再開**: 中断後は loop-state.md の in-progress を根拠に、`/loop /outer-loop` を
  再起動するだけで同じ feature から安全に再開できる（新規選択はしない）。
- **注意**: Amazon Bedrock / Google Cloud / Microsoft Foundry 経由では `loop.md` は
  読まれず、間隔省略時は固定 10 分間隔になる。

## 他ツールとの整合

- **Codex**: `outer-loop` / `feature-cycle` は `.agents/skills/` に複製され
  （同期規約は `docs/07`）、**1 反復ずつ手動実行**する。自動反復（スケジューラ）は
  Claude Code の `/loop` 固有機能であり Codex には持ち込まない。
- **GitHub Copilot / Gemini CLI**: 今回は自動反復を追加しない。
  `.github/prompts/` / `.gemini/commands/` にも outer-loop / feature-cycle を追加しない。
- 共通の内部品質ループ・TDD・証跡・ReleaseJudge 専権は全系統で不変（`docs/07` の
  系統間同期規約）。

## 将来拡張（今回は実装しない）

- `backlog_source: github-issues`: GitHub Issues を backlog 正本にする案。
  ready ラベルによる選択、Issue 状態（ready / in-progress / blocked / completed）の同期、
  依存 Issue・優先度の扱いを含めて**選択ロジックは未実装**。採用する場合は
  `outer_loop.backlog_source` の追加値として設計し直し、`gh` 前提・リモート前提を
  project-profile 側の設定に閉じること。
