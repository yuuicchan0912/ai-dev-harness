# 00 — 読み込み順序と profile 分離

## 読み込み順序

1. `CLAUDE.md`（リポジトリルート。Claude Code の主指示）
2. `.claude/active-profile.md`
3. `.claude/project-profile.md`
4. `.claude/rules/`
5. `.claude/active-profile.md` で指定された profile のみ

## 未選択 profile 読込禁止

- `.claude/profiles/` 配下は、active-profile.md に列挙されたパスだけを Read / Grep してよい。
- Read / Grep / Bash 経由を問わず、`.claude/active-profile.md` に列挙されていない
  `.claude/profiles/` 配下の profile を読んではならない。
- 列挙されていない profile を読むこと・内容を実装や会話に反映することを禁止する。
- この禁止は PreToolUse hook（`.claude/hooks/guard-active-profile-read.js`）でも強制される。
  hook はディレクトリ指定の Grep（未選択 profile へ波及する）も拒否する。
- 例外はない。スタックを切り替えたいときは active-profile.md のポインタを書き換える。

## backend profile 固定見出し（この順序・文字列で全 5 ファイルに存在すること）

1. このprofileの有効条件
2. 技術スタック
3. ディレクトリ規約
4. API契約の置き場所
5. 認証/認可方針
6. DB/ORM方針
7. Migrationコマンド
8. Seeder/Fixtureコマンド
9. テストコマンド
10. Lint/静的解析コマンド
11. 依存監査コマンド
12. ローカル起動コマンド
13. CIテストジョブ例
14. このスタック固有の禁止事項

## infra profile 固定見出し（この順序・文字列で全 3 ファイルに存在すること）

1. このprofileの有効条件
2. デプロイ単位
3. 実行環境
4. IaC/設定管理方針
5. 環境規約
6. シークレット管理
7. DB/ストレージ方針
8. CI/CD連携
9. コスト管理方針
10. 監視/ログ方針
11. 禁止操作

## skill からの参照規約

skill は技術固有コマンドを直接書かない。上記の固定見出し名で profile を参照する
（例:「backend_profile の『テストコマンド』を使う」）。見出しが固定文字列であることが
この参照の前提。
