---
name: plan-feature
description: 要求を feature-contract（仕様・API契約・テスト観点表・受け入れ条件）に落とし、人間承認で凍結する。互換マトリクス検証を最初に行う。
---

# plan-feature

## 目的
要求を実装前に契約として固定し、以降の TDD ループの土台にする。

## 入力
- 人間の要求 / スプリント目標
- `.claude/active-profile.md`、`.claude/project-profile.md`、`templates/feature-contract.md`

## 実行手順
1. active-profile の backend×infra 組合せを `docs/08_profile_switching.md` の互換マトリクスで
   検証する。`unsupported` / `caution` なら blocked にして人間へ profile 修正を依頼し停止。
   あわせて、選択中 `ui_profile` の `前提frontend_profile` が現在の `frontend_profile` と
   一致することを確認する。不一致なら blocked にして人間へエスカレーションする。
   未選択 `ui_profile`（`ui_profile:` が指していない側）は読まない。
2. compose 構成の有無を確認（無ければ最初の契約を「開発環境のコンテナ化」にする）。
3. `<feature-id>` を決める。
4. `templates/feature-contract.md` の様式で 背景 / 仕様 / API契約 / テスト観点表 /
   受け入れ条件 を記述する。テスト観点は 1 観点 = 1 イテレーション粒度にする。
5. done-definition を参照し完了条件を確定する。
6. 人間へ提示し、承認をもって凍結する。
7. 凍結した契約を `harness/contracts/<feature-id>.md` へ保存する（実行証跡の
   `harness/evidence/<feature-id>/` とは別。役割分担は `rules/30` 参照）。

## 禁止事項
- 実装・テストコードを書くこと。completed 判定。未選択 profile の参照。

## 完了条件
- 承認・凍結された feature-contract が `harness/contracts/<feature-id>.md` に存在し、
  `<feature-id>` が確定している。

## 出力フォーマット
- feature-contract 本文（テスト観点表を含む）。invalid 時は blocked 理由と必要判断。
