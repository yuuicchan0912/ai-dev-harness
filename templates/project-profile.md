# project-profile（雛形）

> 実プロジェクトでは、このファイルを `.claude/project-profile.md` へコピーして記入します。
> プロジェクト固有情報はコピー先にのみ置きます。ハーネス本体には固有名詞を書きません。

## プロダクト概要

{{一言でのプロダクト説明}}

## ドメイン用語

- {{用語}}: {{定義}}

## 環境変数一覧

| 変数名 | 用途 | 公開/サーバ限定 |
| --- | --- | --- |
| {{VAR_NAME}} | {{用途}} | {{public / server}} |

（値そのものは書かない。公開してよい値のみ `NEXT_PUBLIC_` 等を付ける。）

## リポジトリ規約

- ブランチ運用: {{記入}}
- コミット規約: {{記入}}
- レビュー規約: {{記入}}
- ディレクトリ規約の補足: {{記入}}

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

- {{役割}}: {{役割ベースの連絡手段。個人情報は書かない}}
