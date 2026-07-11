# project-profile

> これは雛形の初期コピーです。実プロジェクトでは `templates/project-profile.md` を
> このパス（`.claude/project-profile.md`）へコピーし、以下を記入してください。
> プロジェクト固有情報はこのファイルにのみ置きます。ハーネス本体（rules / profiles /
> agents / skills / docs）には固有名詞・DB名・サービス名・個人情報を書きません。

## プロダクト概要

{{一言でのプロダクト説明}}

## ドメイン用語

- {{用語}}: {{定義}}

## 環境変数一覧

| 変数名 | 用途 | 例(値は書かない) |
| --- | --- | --- |
| {{VAR_NAME}} | {{用途}} | {{placeholder}} |

## リポジトリ規約

- ブランチ運用: {{記入}}
- コミット規約: {{記入}}
- レビュー規約: {{記入}}

### 外部ループ設定（`docs/09_external_loop.md`。初期値のまま = 外部ループ無効）

```yaml
outer_loop:
  enabled: false
  backlog_source: sprint-contract
  push_allowed: false
  pr_allowed: false
  branch_pattern: feature/<feature-id>
```

## 有効な技術構成

`.claude/active-profile.md` を参照（このファイルには複製しない）。

## 連絡先 / エスカレーション先

- {{役割}}: {{連絡手段。個人情報は書かず、役割ベースで記載}}
