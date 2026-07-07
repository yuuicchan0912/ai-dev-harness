---
applyTo: "**"
---

# バックエンド方針（Copilot 用）

- バックエンドは `.claude/active-profile.md` の `backend_profile` を正とする。
- Django / Go / Node.js / PHP(Laravel) / Ruby on Rails の**未選択 profile を読まない**
  （Read / Grep / Bash 経由を問わず）。
- API 契約・認証/認可・DB/ORM・Migration・依存監査・テストコマンドは、選択中 profile の
  固定見出しを参照する（技術固有コマンドを直接書かない）。

詳細: active-profile が指す `.claude/profiles/backend/<選択>.md` のみ。
