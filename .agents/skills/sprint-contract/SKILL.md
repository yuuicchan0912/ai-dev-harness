---
name: sprint-contract
description: スプリント開始時にスコープ・非スコープ・DoD参照・打ち切り条件・期間を契約化する。
---

# sprint-contract

## 目的
スプリント単位の合意を固定し、feature 群の親契約にする。

## 入力
- スプリント目標、`templates/sprint-contract.md`、active-profile / project-profile

## 実行手順
1. スプリントのスコープと非スコープを列挙する。
2. 対象 feature（`<feature-id>` 候補）を挙げ、優先順を付ける。
3. DoD（done-definition）への参照を明記する。
4. 打ち切り条件（blocked 化・撤退基準）と期間を定義する。
5. 人間承認をもって確定する。

## 禁止事項
- 実装。completed 判定。未選択 profile の参照。

## 完了条件
- 承認済み sprint-contract が存在する。

## 出力フォーマット
- sprint-contract 本文（スコープ / 非スコープ / DoD参照 / 打ち切り条件 / 期間）。
