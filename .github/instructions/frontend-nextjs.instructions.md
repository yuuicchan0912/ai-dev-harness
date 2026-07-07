---
applyTo: "**"
---

# フロントエンド方針（Copilot 用）

- フロントエンドは Next.js を標準とする（`frontend_profile`）。
- 技術固有コマンド（テスト / Lint / 型チェック / E2E）は profile の固定見出しを参照し、
  直接書かない。ホスト直接実行はせず Docker 経由（テスト・CI 前提）。
- サーバー / クライアントコンポーネント規約に従い、秘密をクライアントに持ち込まない。

詳細: `.claude/profiles/frontend/nextjs.md`（active-profile が指す場合のみ有効）。
