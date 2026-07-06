# 04 — 品質ゲート

`rules/30-quality-gate.md` が正本。ここでは運用の補足と CI 例を示します。

## ゲート順序

1. テスト（Docker 内で全件緑）
2. Lint / 静的解析 / 型チェック
3. 依存監査（backend_profile の「依存監査コマンド」）
4. 契約突合（API 契約・受け入れ条件と実装の一致）
5. CI（緑を確認）
6. セキュリティ（SecurityReview + デプロイ前は pre-deploy-security-check）
7. DoD（done-definition 全項目）

前段が通らなければ次段へ進めません。

## 3 値判定と unknown 昇格

- 各項目は pass / fail / unknown で記録。証跡パスが空なら自動 unknown。
- unknown が 1 つでもあれば completed / deployable にできず blocked。
- fail / blocker があれば rejected または blocked。

## 証跡ディレクトリ

```
harness/evidence/<feature-id>/
  red.log green.log test.log lint.log typecheck.log dependency-audit.log
  ci-status.md evaluator-report.md security-report.md
  pre-deploy-security-check.md final-operation-check.md release-decision.md
```

## CI 確認方針

- 原則 CI 緑の証跡を `ci-status.md` に保存する（`gh run` などの結果を記録）。
- Claude Code 環境で CI 確認ができない場合は、ローカルのフルテストログ + 人間の CI 確認を
  証跡として `ci-status.md` に記録する。
- CI 未確認のまま completed / deployable は禁止。

## GitHub Actions 最小テストジョブ例

各 backend profile の「CIテストジョブ例」にスタック別の完全例があります。共通形は次の通り。

```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build
      # 以降は active な backend_profile の「CIテストジョブ例」に従い
      # lint → typecheck → test → dependency-audit をコンテナ内で実行する
```

ローカルと CI は同一イメージ・同一コマンドを使い、「ローカルで緑 = CI で緑」を担保します。
