---
name: frontend-ui-loop
description: Next.js UI 実装の TDD ループ（コンポーネントテスト→実装→E2E/スモーク）。技術固有コマンドは frontend_profile を参照する。
---

# frontend-ui-loop

## 目的
UI を 1 観点ずつ TDD で進め、主要導線を E2E で確認する。

## 入力
- 凍結済み feature-contract、red.log、`<feature-id>`
- active-profile の frontend_profile（テスト / E2E / lint / 型チェックコマンドの参照元）
- `.claude/active-profile.md` の `ui_profile:`（選択中の UI ライブラリ profile。デフォルトは shadcn/ui）

## 実行手順
1. コンポーネント / ユニット観点を 1 つ選ぶ。
2. green: frontend_profile の「テストコマンド」で通す最小実装を書く。
   UI 実装は選択中 `ui_profile` の固定見出し（設計思想 / 依存パッケージ /
   コンポーネント配置規約 / テーマ・スタイル方針 / アクセシビリティ方針 等）を参照する。
   UI ライブラリ固有のコマンド・設定は `ui_profile` に閉じる。
3. サーバー / クライアントコンポーネント規約を守る（秘密をクライアントに持ち込まない）。
4. refactor: 挙動を変えず整理する。
5. 主要導線は frontend_profile の E2E / スモークコマンドで確認する。
   確認観点にアクセシビリティ、表示崩れ、フォーム操作を含める。
6. 全テスト緑を確認し green.log を更新する。

テスト / lint / 型チェックの実行コマンドは常に frontend_profile を参照する
（`ui_profile` は実行コマンド正本を持たない）。

## 禁止事項
- 契約変更（Planner 経由でのみ）。テスト弱体化。completed 判定。
- ホスト直接実行。技術固有コマンドの直書き。未選択 profile 参照。
- 未選択 `ui_profile`（`ui_profile:` が指していない側の shadcn.md / mui.md）を読むこと。
- shadcn/ui と MUI の同時採用（初期版では hybrid profile を作らない）。

## 完了条件
- 全観点が緑、主要導線の E2E / スモークが緑、契約と一致。
- 選択中 `ui_profile` のアクセシビリティ・配置・テーマ方針に沿っている。

## 出力フォーマット
- 実装差分の要約、消化観点一覧、E2E/スモーク結果、green.log のパス。
