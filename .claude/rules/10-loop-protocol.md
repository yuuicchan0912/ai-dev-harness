# 10 — ループプロトコル

## 状態遷移

```
contract → red → green → refactor → evaluate → security → judge → completed
                                        ↑___ 差し戻し（red / green へ）
   いずれの状態からでも → blocked（人間の判断待ち）
   judge の結果 → completed / rejected / blocked
```

状態一覧: `contract` / `red` / `green` / `refactor` / `evaluate` / `security` /
`judge` / `completed` / `rejected` / `blocked`。

## 各状態の意味

- **contract**: feature-contract を作成・凍結する（Planner）。
- **red**: 契約のテスト観点表から失敗するテストを書き、失敗ログを証跡化する。
- **green**: テストを通す最小実装（1 イテレーション = 1 テスト観点が目安）。
- **refactor**: テスト緑のまま整理。ここでテストの expectation を書き換えない。
- **evaluate**: Evaluator が全テスト・静的解析・依存監査・契約突合を実行。
- **security**: SecurityReviewer がレビュー。デプロイ前は pre-deploy-security-check も実施。
- **judge**: ReleaseJudge が証跡だけで completed / deployable / rejected / blocked を判定。

## 1 イテレーションの上限

- 1 イテレーション = 1 テスト観点を目安にし、変更範囲を小さく保つ。
- 大きな変更が必要なら契約を分割して Planner に戻す。

## blocked への遷移条件

以下は推測で進めず `blocked` にし、人間へエスカレーションする。

- 同一エラーが 3 回連続で解消しない。
- active-profile.md の backend×infra 組合せが互換マトリクス上 invalid。
- 仕様の不明点・契約の穴で判断できない。
- CI 確認が環境的にできない（代替証跡も取れない）。
- 秘密情報の取り扱いなど、人間の承認が必要な操作。

blocked にしたら、理由・必要な判断・再開条件を明記して停止する。
