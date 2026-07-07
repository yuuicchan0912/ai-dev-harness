---
applyTo: "**"
---

# TDD 方針（Copilot 用）

- TDD 必須。失敗するテスト（RED 証跡 `harness/evidence/<feature-id>/red.log`）なしに
  実装コードを書かない。
- テストの弱体化・skip・todo で緑にしない。テスト変更が正当なのは契約変更（Planner 経由）
  のときだけ。
- ループの流れ: contract → red → green → refactor → evaluate → security → judge
  （completed / rejected / blocked）。

詳細: `.claude/rules/20-tdd-protocol.md`・`.claude/rules/10-loop-protocol.md`。
