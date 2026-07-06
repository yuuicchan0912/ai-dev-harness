# 02 — ループエンジニアリング

## 状態遷移

```
contract → red → green → refactor → evaluate → security → judge → completed
                                        └ 差し戻し（red / green へ）
   任意の状態 → blocked（人間判断待ち）
   judge → completed / deployable / rejected / blocked
```

状態一覧: contract / red / green / refactor / evaluate / security / judge /
completed / rejected / blocked（`rules/10-loop-protocol.md` が正本）。

## 各状態の担当と成果物

- **contract**（Planner）: feature-contract を凍結。
- **red**（Generator）: 失敗テスト + `red.log`。
- **green**（Generator）: 最小実装 + `green.log`。
- **refactor**（Generator）: 挙動不変の整理。
- **evaluate**（Evaluator）: test/lint/typecheck/dependency-audit ログ + evaluator-report。
- **security**（SecurityReviewer）: security-report + pre-deploy-security-check。
- **judge**（ReleaseJudge）: release-decision。

## ループ暴走の防止

- 1 イテレーション = 1 テスト観点を目安に、変更範囲を小さく保つ。
- 同一エラーが 3 回連続で解消しなければ blocked にして人間へ。
- 大きすぎる変更は契約を分割して Planner に戻す。

## blocked への遷移条件

- 同一エラー 3 回。
- backend×infra 互換マトリクス invalid。
- 仕様不明・契約の穴で判断不能。
- CI 確認が環境的に不能（代替証跡も取れない）。
- 人間承認が必要な操作（本番適用・秘密の取り扱い）。

blocked では、理由・必要な人間判断・再開条件を明記して停止する。推測で先に進めない。

## サブエージェントの使いどころ

- 使う: Evaluator / SecurityReviewer（実装文脈に汚染されない独立レビューが価値）、
  大規模調査、並列可能な独立機能実装。
- 使わない: RED↔GREEN の往復（文脈連続性が重要）、小さな修正、契約作成の対話。

## メインエージェントの役割

- 各 agent の出力を証跡ファイルへ保存する（判定は改変しない）。
- 状態遷移を管理し、ゲート未通過なら次工程へ進めない。
