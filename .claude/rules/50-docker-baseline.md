# 50 — Docker 基本方針

## Docker 必須の適用範囲

Docker が必須なのは次の 3 つに限定する。

1. ローカル開発（`docker compose up` で全サービス起動）
2. テスト実行（全テストコマンドは `docker compose exec <service> ...` 形式）
3. CI のテストジョブ（ローカルと同一イメージ・同一コマンド）

「ローカルで緑 = CI で緑」の再現性をこの 3 範囲で担保する。

## デプロイ先ランタイムは対象外

- デプロイ先の本番実行環境は infra_profile に従う。Docker 要件の対象外。
- 例: Vercel + Supabase 構成では、本番実行環境は Vercel / Supabase のマネージド環境でよい。
  この場合の「Docker 環境で起動」確認（final-operation-check）は compose 環境での
  起動・migration・テスト緑を指し、本番ランタイムでの起動を意味しない。
- Supabase のローカル開発（`supabase start` 等）は内部的に Docker を使うため整合する。

## ホスト直接実行の扱い

- 言語ランタイム（python / go / node / php / ruby など）をホストに要求しない。
- テストや lint をホストで直接叩かない。Evaluator は Docker 外実行を差し戻す。
- 例外はコンテナ管理外の操作のみ（git 操作、エディタ操作、`docker` / `docker compose` 自体、
  `gh` による CI 確認、**ハーネス hook 実行用のホスト Node.js**）。
- ハーネスの PreToolUse hook（`guard-active-profile-read.js`）はホストの Node.js で実行される。
  これは Docker 必須の例外であり、アプリケーションの開発・テスト・CI テストジョブは
  引き続き Docker 前提とする。

## compose が無いプロジェクト

- compose 構成が無い場合、Planner は最初の feature-contract として「開発環境のコンテナ化」を
  切る。サービス命名・ボリューム方針は docker profile に従う。
