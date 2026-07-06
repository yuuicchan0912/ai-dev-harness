---
name: spec-to-tests
description: 凍結済み feature-contract のテスト観点表から、失敗するテスト群を生成し全件 RED のログを保存する。
---

# spec-to-tests

## 目的
契約のテスト観点を、実行可能な失敗テストへ変換して TDD の RED を確立する。

## 入力
- 凍結済み feature-contract、`<feature-id>`
- active-profile が指す backend / frontend / testing profile の「テストコマンド」

## 実行手順
1. テスト観点表の各行を 1 テストにマッピングする（1 観点 = 1 テスト目安）。
2. 期待挙動を明示したテストを書く（実装はまだ書かない）。
3. active-profile の該当 profile の「テストコマンド」で実行し、全件失敗を確認する。
4. 失敗ログを `harness/evidence/<feature-id>/red.log` に保存する。

## 禁止事項
- 実装コードを書くこと。テストを skip / todo にすること。技術固有コマンドの直書き
  （必ず profile の見出しを参照）。未選択 profile の参照。

## 完了条件
- 全観点にテストが存在し、全件 RED のログが red.log に保存されている。

## 出力フォーマット
- 生成テスト一覧と red.log のパス。観点↔テストの対応表。
