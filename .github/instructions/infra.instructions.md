---
applyTo: "**"
---

# インフラ方針（Copilot 用）

- インフラは `.claude/active-profile.md` の `infra_profile` を正とする。
- AWS / GCP / Vercel+Supabase の**未選択 profile を読まない**（Read / Grep / Bash 経由を問わず）。
- デプロイ先ランタイムは infra_profile に従う。
- Docker 必須の範囲はローカル開発・テスト・CI テストジョブ。デプロイランタイムは
  Docker 要件の**対象外**。

詳細: active-profile が指す `.claude/profiles/infra/<選択>.md` のみ、
`.claude/rules/50-docker-baseline.md`。
