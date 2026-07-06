# review-report（Evaluator / SecurityReviewer 共通雛形）

- 対象 feature-id: {{id}}
- レビュー種別: {{evaluator / security / pre-deploy-security}}
- 実施日時: {{日付}}

## 実行コマンドとログ要約
| 項目 | コマンド | 状態(pass/fail/unknown) | 証跡パス |
| --- | --- | --- | --- |
| {{テスト}} | {{profile 参照}} | {{状態}} | {{path}} |

## 指摘一覧
| # | 重大度(blocker/major/minor / high/medium/low) | 内容 | 再現手順 | 該当箇所 |
| --- | --- | --- | --- | --- |
| 1 | {{重大度}} | {{指摘}} | {{手順}} | {{path}} |

## 判定
- 結果: {{pass に相当する所見 / 差し戻し}}（最終の completed/deployable 判定は ReleaseJudge）
- 未確認項目: {{無い場合も「無し」と明記}}
- 次アクション: {{差し戻し先 / 追加確認}}

> 注: このレポートを書くエージェント（evaluator / security-reviewer）は Edit / Write を
> 持たない。本文を出力し、メインエージェントが所定の証跡ファイルへ保存する。保存時に許可される
> 変更は Markdown 整形・ファイルパス追記・日時追記のみ。判定内容は改変しない。
