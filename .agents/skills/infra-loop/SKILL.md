---
name: infra-loop
description: IaC / デプロイ設定変更のループ（plan → 人間レビュー → apply）。apply は人間承認必須。技術固有手順は infra_profile を参照する。
---

# infra-loop

## 目的
インフラ変更を通常の実装ループから分離し、安全に適用する。

## 入力
- 変更要求、`<feature-id>`
- active-profile の infra_profile（IaC / 設定管理方針・環境規約・禁止操作の参照元）

## 実行手順
1. infra_profile の「IaC/設定管理方針」に従い変更を記述する。
2. plan を生成する（Vercel+Supabase 等 IaC が薄い構成では、プレビューデプロイ +
   migration の dry-run を plan 相当として扱う）。
3. plan を人間へ提示しレビューを受ける。
4. 人間承認後にのみ apply する（承認なしの apply は禁止）。
5. 適用結果と確認内容を証跡として記録する。

## 禁止事項
- 人間承認なしの apply。本番リソースの手動直接変更。禁止操作（infra_profile 記載）。
- 未選択 profile 参照。

## 完了条件
- plan がレビュー済み、apply が人間承認済み、結果が記録済み。

## 出力フォーマット
- 変更概要、plan 要約、承認記録、適用結果。
