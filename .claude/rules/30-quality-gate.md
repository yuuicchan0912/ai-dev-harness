# 30 — 品質ゲート

## ゲート順序（前段が通らなければ次段へ進めない）

1. テスト（Docker 内で全件緑、実行ログあり）
2. Lint / 静的解析 / 型チェック
3. 依存監査（backend_profile の「依存監査コマンド」を実行）
4. 契約突合（feature-contract の API 契約・受け入れ条件と実装の一致）
5. CI（緑を確認、証跡化）
6. セキュリティ（SecurityReviewer + デプロイ前は pre-deploy-security-check）
7. DoD（done-definition の全項目）

各ゲートの未通過は次工程を禁止する。推測での通過は不可（証跡がない項目は unknown）。

## 3 値判定と unknown 昇格

- 項目の状態は `pass` / `fail` / `unknown` で記録する。
- 証跡ファイルパスが空の項目は自動的に `unknown` とする。
- `unknown` が 1 つでもあれば、リリース判定は completed / deployable にできず `blocked`。
- `fail` が 1 つでもあれば `rejected` または `blocked`。

## 証跡ディレクトリ規約（固定）

すべての証跡は `harness/evidence/<feature-id>/` 配下に固定パスで保存する。

```
harness/evidence/<feature-id>/
├── red.log
├── green.log
├── test.log
├── lint.log
├── typecheck.log
├── dependency-audit.log
├── ci-status.md
├── evaluator-report.md
├── security-report.md
├── pre-deploy-security-check.md
├── final-operation-check.md
├── failure-report.md（外部ループ失敗時のみ・任意）
└── release-decision.md
```

`release-decision.md` が存在しない限り completed は禁止（`rules/70-completed-policy.md` と対）。

`failure-report.md` は外部ループ（`docs/09_external_loop.md`）で **feature-id 確定後に
失敗した場合のみ**作成する任意証跡（必須証跡ではない）。blocked 時に自動 commit せず、
branch 上の未コミット変更として残す（failure-report 単独の自動 commit は禁止。
`rules/10` の外部ループ節）。secret は必ずマスクする。後に completed へ到達した場合、
必要に応じて最終 commit へ含める。

複数 feature を束ねてデプロイする場合は `harness/evidence/release/<release-id>/` に
ci-status / final-operation-check / release-decision を置き、構成 feature の evidence
ディレクトリを release-decision.md 内で列挙参照する。

## 契約の保存先と役割分担

- 凍結済み feature-contract は `harness/contracts/<feature-id>.md` に保存する。
- feature-id は短い kebab-case の機能名にする（例: `login-form`、`profile-edit`、`csv-export`）。
- sprint-contract は `harness/contracts/sprint-<id>.md` に保存する
  （feature-contract の `harness/contracts/<feature-id>.md` とは区別する）。
- 役割分担: `harness/contracts/<feature-id>.md` は**凍結契約**（仕様・API契約・テスト観点表・
  受け入れ条件）、`harness/evidence/<feature-id>/` は**実行証跡**（テストログ・レポート・判定）。
- 契約変更は Planner 経由でのみ行い、変更履歴を契約ファイル内に記録する（`rules/20`）。

## 証跡のコミット方針

- `harness/evidence/<feature-id>/` はレビュー・監査用の証跡として**原則コミット対象**とする。
- 既存 `.gitignore` で `*.log` が除外されている場合は、必要に応じて
  `!harness/evidence/**/*.log` の例外設定を検討する。
- ただし、証跡ログに secret・個人情報・アクセストークン・接続文字列などが含まれる場合は、
  必ずマスクしてから保存する。**secret を含むログのコミットは禁止。**

## CI 確認方針

- 原則 CI 緑の証跡を `ci-status.md` に保存する（`gh run` などの結果を記録）。
- Claude Code 環境で CI 確認ができない場合は、ローカルのフルテストログ + 人間の CI 確認を
  証跡として `ci-status.md` に記録する。
- CI 未確認のまま completed / deployable は禁止。
- GitHub Actions の最小テストジョブ例は `docs/04_quality_gate.md` と各 backend profile の
 「CIテストジョブ例」見出しにある。
