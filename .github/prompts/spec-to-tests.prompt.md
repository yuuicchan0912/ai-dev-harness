---
mode: agent
description: 凍結済み feature-contract から失敗するテスト群を作成し RED 証跡を残す
---

# spec-to-tests

## 目的
契約のテスト観点を、実行可能な失敗テストへ変換して RED を確立する。

## 入力
- `harness/contracts/<feature-id>.md`（凍結契約）
- active-profile が指す backend / frontend / testing profile の「テストコマンド」

## 実行手順
1. テスト観点表の各行を 1 テストにマッピングする（1 観点 = 1 テスト）。
2. 期待挙動を明示したテストを書く（実装はまだ書かない）。
3. 選択中 profile の「テストコマンド」で実行し、全件失敗を確認する。
4. 失敗ログを `harness/evidence/<feature-id>/red.log` に保存する。

## 禁止事項
- 実装コードを書く。テストを skip / todo にする。技術固有コマンドの直書き。未選択 profile 参照。

## 出力フォーマット
- 生成テスト一覧・観点↔テスト対応表・RED 証跡 `harness/evidence/<feature-id>/red.log`。

## 参照先
`.claude/skills/spec-to-tests/SKILL.md`（正本）・`.claude/rules/20-tdd-protocol.md`。
