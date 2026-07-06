# 06 — モデル戦略

原則: **判断は上位モデル、生成は主力モデル**。出力量が少なく質が結果を左右する工程に
上位モデルを割り当てます。

## 割り当て

- **Fable5**（使える場合）: Planner、ReleaseJudge、アーキテクチャ判断、契約設計、
  行き詰まったループの原因分析。長大な本文生成には使わない。
- **Opus**: Generator（複雑な実装）、Evaluator、SecurityReviewer、大きめのリファクタ。
  Fable5 が使えない場合の Planner / ReleaseJudge も担う。
- **Sonnet**: Generator（定型実装 / CRUD / テスト雛形）、ドキュメント整形、調査系。

## 1 機能あたりの典型配分

- 契約 = Fable5（無ければ Opus）
- テスト生成 = Sonnet
- 実装 = Opus / Sonnet
- レビュー（Evaluator / Security）= Opus
- 最終判定 = Fable5（無ければ Opus）

## agents の model 指定

`.claude/agents/*.md` の frontmatter で model を固定しています。初期値は全 agent を
`opus` にしていますが、Fable5 が使える環境では planner / release-judge を Fable5 に、
定型 generator を sonnet に変更してよい（frontmatter の `model` を書き換える）。

## デプロイ前チェックを Opus で回す場合の品質補正

Fable5 が使えず Opus で pre-deploy-security-check / final-operation-check を実行する場合、
以下で品質を担保します。

- 各観点をチェックリストで 1 項目ずつ機械的に消化する。
- 証跡パスが空の項目は自動 unknown（推測 PASS を形式で禁止）。
- release-decision.md はテンプレ穴埋めにし、未確認項目欄が空でも「無し」と明記させる。

## サブエージェントとモデル

Evaluator / SecurityReviewer を独立サブエージェントにするのは、実装文脈からの独立性が
レビュー品質に効くため。小さな作業や RED↔GREEN の往復では新規サブエージェントを起動しない
（コールドスタートのコストが高い）。
