# 07 — 別プロジェクトへの適用手順

## 手順

1. **コピー**: `.claude/` `templates/` `docs/` `harness/` を対象リポジトリのルートへコピーする。
2. **active-profile 選択**: `templates/active-profile.md` を `.claude/active-profile.md` に置き、
   frontend / backend / infra / docker / testing の 5 ポインタを 1 つずつ選ぶ。
3. **project-profile 記入**: `templates/project-profile.md` を `.claude/project-profile.md` に
   コピーし、プロダクト概要・ドメイン用語・環境変数名・リポジトリ規約を記入する。
4. **互換確認**: `docs/08_profile_switching.md` の互換マトリクスで backend×infra が supported か
   確認する。unsupported / caution なら構成を見直す。
5. **compose 確認**: docker compose 構成を確認する。無ければ最初の feature-contract として
   「開発環境のコンテナ化（web / api / db）」を切る。
6. **hook 有効化確認**: `.claude/settings.json` の PreToolUse hook が読み込まれることを確認する。
7. **スモーク**: Claude Code に「有効な profile 構成を報告せよ」と聞き、未選択 profile が
   混ざらないこと、hook が未選択 profile の Read をブロックすることを確認する。
8. **運用開始**: sprint-contract を作成し、feature 単位で Planner から回す。

## 適用後の最初のスプリント

- compose が無ければコンテナ化を最優先の feature にする。
- 1 つ目の feature を Planner → Generator → Evaluator → SecurityReviewer → ReleaseJudge まで
  通し、証跡ディレクトリ運用が機能することを確認する。

## 注意

- ハーネス本体には固有情報を書かない。固有情報は `.claude/project-profile.md` にのみ。
- 初期版は 1 リポジトリ 1 バックエンド前提（`docs/00_concept.md`）。
- スタックを変えるときは active-profile のポインタだけを書き換える（`docs/08`）。

## アップデートの取り込み

- ハーネス更新時は rules / profiles / agents / skills / docs を差し替える。
- `.claude/active-profile.md` と `.claude/project-profile.md` は各プロジェクトの実体なので
  上書きしない（templates 側が正、`.claude/` 側はコピー実体）。
