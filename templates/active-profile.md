# active-profile（雛形）

> このファイルを `.claude/active-profile.md` へコピーして使います。
> このファイルが指す profile 以外は読み込み禁止。切替は参照先の書き換えのみ
> （コメントアウト切替は禁止）。

```yaml
frontend_profile: .claude/profiles/frontend/nextjs.md
backend_profile: .claude/profiles/backend/django.md
infra_profile: .claude/profiles/infra/aws.md
docker_profile: .claude/profiles/docker/docker-required.md
testing_profile: .claude/profiles/testing/tdd-required.md
```

## 選択肢（ファイル名のみ表記。フルパスは書かない）

> 有効化するときは、上の YAML の `*_profile:` 行の参照先だけを書き換える。
> コメントアウト切替は禁止（候補を複数行残さない）。
> ここではファイル名だけを挙げる。フルパスを書くと hook の許可リスト誤抽出の原因になる。

backend_profile の候補（`.claude/profiles/backend/` 配下）:
- `node.md`
- `django.md`
- `go.md`
- `laravel.md`
- `rails.md`

infra_profile の候補（`.claude/profiles/infra/` 配下）:
- `vercel-supabase.md`
- `aws.md`
- `gcp.md`

> 切替後は `docs/08_profile_switching.md` の互換マトリクスで組合せが supported か必ず確認する。
