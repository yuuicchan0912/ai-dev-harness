# active-profile

このファイルが指す profile 以外は読み込み禁止。
`.claude/profiles/` 配下は、下の YAML に列挙されたパスだけを Read / Grep してよい。
切り替えは参照先の書き換えのみで行う（コメントアウト切替は禁止）。

```yaml
frontend_profile: .claude/profiles/frontend/nextjs.md
ui_profile: .claude/profiles/ui/shadcn.md
backend_profile: .claude/profiles/backend/django.md
infra_profile: .claude/profiles/infra/aws.md
docker_profile: .claude/profiles/docker/docker-required.md
testing_profile: .claude/profiles/testing/tdd-required.md
```

## 切替時の注意

- backend / infra を変える場合は上の該当行の参照先だけを変更する。
- UI ライブラリは `ui_profile:` で選択する。デフォルトは shadcn/ui。MUI を使う場合のみ
  `ui_profile:` の参照先を `mui.md`（`.claude/profiles/ui/` 配下）に書き換える。shadcn/ui と
  MUI の同時採用は原則禁止（必要なら hybrid profile を別途用意する）。切替時は各 UI profile の
  `前提frontend_profile` が現在の `frontend_profile` と一致することを確認する。
- 変更後、必ず `docs/08_profile_switching.md` の backend×infra 互換マトリクスで
  組合せが `supported` か確認する。`unsupported` / `caution` の場合は Planner が
  作業を `blocked` にして人間へ profile 修正を依頼する。
- project 固有情報は `.claude/project-profile.md` にのみ置く（このファイルには書かない）。
