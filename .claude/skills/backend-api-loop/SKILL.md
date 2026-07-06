---
name: backend-api-loop
description: バックエンド API 実装の TDD ループ（red→green→refactor を 1 観点ずつ）。技術固有コマンドは active-profile の backend_profile を参照する。
---

# backend-api-loop

## 目的
API 実装を 1 テスト観点ずつ TDD で進める。

## 入力
- 凍結済み feature-contract、red.log（RED 済み）、`<feature-id>`
- active-profile の backend_profile（テスト / migration / lint / 依存監査コマンドの参照元）

## 実行手順
1. 未消化の観点を 1 つ選ぶ。
2. green: backend_profile の「テストコマンド」で対象テストを通す最小実装を書く。
3. 必要なら backend_profile の「Migrationコマンド」でスキーマを更新する。
4. refactor: 挙動を変えずに整理する。
5. 全テストを再実行して緑を確認し `green.log` を更新する。
6. 全観点を消化するまで繰り返す。

## 禁止事項
- 契約変更（Planner 経由でのみ）。テスト弱体化。completed 判定。
- ホスト直接実行（Docker 経由のみ）。技術固有コマンドの直書き。未選択 profile 参照。

## 完了条件
- 全観点が緑。green.log が最新。契約と実装が一致。

## 出力フォーマット
- 実装差分の要約、消化した観点一覧、green.log のパス。
