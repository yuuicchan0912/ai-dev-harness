---
applyTo: "**"
---

# フロントエンド方針（Copilot 用）

- フロントエンドは Next.js を標準とする（`frontend_profile`）。
- 技術固有コマンド（テスト / Lint / 型チェック / E2E）は profile の固定見出しを参照し、
  直接書かない。ホスト直接実行はせず Docker 経由（テスト・CI 前提）。
- サーバー / クライアントコンポーネント規約に従い、秘密をクライアントに持ち込まない。
- UI ライブラリは `.claude/active-profile.md` の `ui_profile:` が指す profile のみに従う
  （デフォルトは shadcn/ui）。未選択 ui_profile は読まない。
- UI 実装時は選択中 ui_profile の固定見出し（設計思想 / 依存 / 配置 / テーマ /
  アクセシビリティ等）を参照する。UI ライブラリ固有コマンド・設定は ui_profile に閉じる。
- shadcn/ui と MUI の同時採用は禁止（必要なら hybrid profile を別途用意する）。

詳細: `.claude/profiles/frontend/nextjs.md` と `ui_profile:` が指す
`.claude/profiles/ui/` 配下の profile（いずれも active-profile が指す場合のみ有効）。
