---
mode: agent
description: Planner として要求から feature-contract を作成し凍結する
---

# plan-feature

## 目的
要求を実装前に契約として固定し、TDD ループの土台にする。

## 入力
- 人間の要求 / スプリント目標
- `.claude/active-profile.md`・`.claude/project-profile.md`・`templates/feature-contract.md`

## 実行手順
1. active-profile の backend×infra 組合せを `docs/08_profile_switching.md` の互換マトリクスで
   検証する。`unsupported` / `caution` なら blocked にして人間へ profile 修正を依頼し停止。
2. `<feature-id>` を決める。
3. `templates/feature-contract.md` の様式で 背景 / 仕様 / API契約 / テスト観点表 /
   受け入れ条件 を記述する（1 観点 = 1 イテレーション粒度）。
4. 人間へ提示し、承認をもって凍結する。
5. 凍結契約を `harness/contracts/<feature-id>.md` へ保存する。

## 禁止事項
- 実装・テストコードを書く。completed / deployable 判定。未選択 profile の参照。

## 出力フォーマット
- feature-contract 本文 → `harness/contracts/<feature-id>.md`。

## 参照先
`.claude/skills/plan-feature/SKILL.md`（正本）・`.claude/rules/`。
