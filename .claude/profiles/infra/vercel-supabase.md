# infra profile — Vercel + Supabase

> このファイルは `.claude/active-profile.md` から参照されている場合のみ有効。
> 参照されていない場合、この内容を適用してはならない。

## このprofileの有効条件

`.claude/active-profile.md` の `infra_profile` がこのファイルを指しているときのみ有効。
backend×infra 互換は `docs/08_profile_switching.md` のマトリクスに従う（node が supported、
常駐サーバ型 backend は caution/unsupported）。

## デプロイ単位

- フロントエンド / サーバレス API は Vercel のプロジェクト単位。
- DB / 認証 / ストレージは Supabase プロジェクト単位。

## 実行環境

- 本番実行環境は Vercel / Supabase のマネージド環境（Docker 要件の対象外、`rules/50`）。
- ローカルは Docker（`supabase start` は内部的に Docker を使用）。final-operation-check の
  「Docker で起動」は compose 環境での起動・migration・テスト緑を指す。

## IaC/設定管理方針

- IaC は薄い。Vercel はプロジェクト設定、Supabase は migration / config をコード管理する。
- 「plan」に相当する確認は Vercel のプレビューデプロイ + Supabase migration の dry-run。

## 環境規約

- dev / preview / production を分離する。Vercel の環境変数スコープと Supabase プロジェクトで分ける。

## シークレット管理

- 秘密は Vercel / Supabase の環境変数に保存。`NEXT_PUBLIC_` は公開値のみ。
- `service_role` キーをクライアントに露出しない（サーバ側限定）。

## DB/ストレージ方針

- Supabase Postgres を使用。行レベルセキュリティ（RLS）を有効化し、テーブルごとにポリシーを定義。
- ストレージのバケット公開設定を明示的に管理する。
- ローカル開発では `supabase start` が内部的に Docker コンテナ群（DB 含む）を起動する。
  この場合、通常の docker compose 内に `db` サービスを別途持たない構成も許可する。
- compose の `db` サービスを使うか、Supabase CLI のローカル DB を使うかは
  `.claude/project-profile.md` に明記し、**二重に DB を起動して接続先が曖昧にならない**ようにする。

## CI/CD連携

- GitHub 連携で PR ごとにプレビューデプロイ。CI のテストジョブは Docker で実行（`rules/50`）。

## コスト管理方針

- 関数実行時間・帯域・DB 使用量を監視。無制限なバックグラウンド処理を置かない。

## 監視/ログ方針

- Vercel / Supabase のログとダッシュボードを使用。秘密をログに出力しない。

## 禁止操作

- `service_role` キーのクライアント露出。
- RLS 無効のまま公開テーブルを運用すること。
- 本番 Supabase への手動 SQL 直接変更（migration を経由する）。
