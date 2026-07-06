---
name: final-operation-check
description: デプロイ前の最終動作確認を証跡ベースで行う。Docker 起動・migration・テスト・lint・型・依存監査・主要導線・CI を確認し final-operation-check.md に保存する。
---

# final-operation-check

## 目的
デプロイ直前にアプリが実際に動くことを証跡で確認する。Fable5 不使用（Opus 実行）でも
品質を保つため、チェックリストを 1 項目ずつ機械的に消化する。

## 入力
- `<feature-id>`、active-profile の frontend / backend / infra profile
- 既存証跡（test.log / lint.log / typecheck.log / dependency-audit.log / ci-status.md）

## 実行手順（各項目を pass / fail / unknown で記録し、証跡パスを必ず添える）
1. Docker 環境でアプリが起動するか（compose 環境での起動。本番ランタイム起動ではない）。
2. DB migration が成功するか（backend_profile の「Migrationコマンド」）。
3. backend_profile の「テストコマンド」が成功するか。
4. frontend_profile の「テストコマンド」が成功するか。
5. Lint / 静的解析 / 型チェックが成功するか。
6. backend_profile の「依存監査コマンド」が成功するか。
7. 主要導線の E2E / スモークが成功するか。
8. API 契約と実装が一致するか（契約テスト / スキーマ検証の実行ログを証跡にする。
   無ければ unknown）。
9. 環境変数不足で起動失敗しないか。
10. デプロイ前に必要な CI が緑か（`ci-status.md` を確認、無ければ unknown）。

## 共通制約
- 担当はコードを修正しない。推測で PASS にしない。
- 証跡パスが空の項目は自動 unknown。unknown があれば deployable にしない。

## 禁止事項
- コード修正。推測 pass。deployable 判定（判定は ReleaseJudge）。未選択 profile 参照。

## 完了条件
- 全項目が pass / fail / unknown で埋まり、CI 確認結果が `ci-status.md` に保存されている。

## 出力フォーマット
- チェックリスト（項目 / 状態 / 実行コマンド / 証跡パス）。メインエージェントが
  `harness/evidence/<feature-id>/final-operation-check.md` へ保存する。
