# 07 — 別プロジェクトへの適用手順

## 前提チェック

- `node --version` でホストに Node.js があることを確認する（PreToolUse hook の実行に必要）。
  Node.js が無い場合、hook は期待どおり動かず未選択 profile の読込ブロックが無効化される
  可能性があるため、手順 8 の「未選択 profile のブロック確認」を必ず実施する。

## 手順

1. **コピー**: `CLAUDE.md` `.claude/` `templates/` `docs/` `harness/` を対象リポジトリの
   ルートへコピーする。**既存 `.claude/` や `CLAUDE.md` がある場合は無条件コピーで
   上書きしない**（下記「既存 `.claude/` とのマージ」に従う）。
2. **active-profile 選択**: `templates/active-profile.md` を `.claude/active-profile.md` に置き、
   frontend / ui / backend / infra / docker / testing の 6 ポインタを 1 つずつ選ぶ。
   **雛形のデフォルト構成は `nextjs + shadcn/ui + django + aws`**。異なるスタック
   （例: Node.js + Vercel+Supabase）で使う場合は該当する `*_profile:` 行を書き換え、切替後に
   `docs/08` の互換マトリクスを確認する。
   - **`ui_profile:` を確認する**: UI ライブラリはデフォルト shadcn/ui。MUI を使う場合のみ
     `ui_profile:` を `.claude/profiles/ui/mui.md` へ変更する。shadcn/ui と MUI の同時採用は
     原則禁止（必要なら hybrid profile を別途用意する）。UI profile の `前提frontend_profile` が
     現在の `frontend_profile` と一致することを確認する。
   - **既存プロジェクトに既に UI ライブラリがある場合は上書きせず**、既存構成と選択した
     `ui_profile` の方針をマージする（既存コンポーネント・theme・依存を活かす）。
3. **project-profile 記入**: `templates/project-profile.md` を `.claude/project-profile.md` に
   コピーし、プロダクト概要・ドメイン用語・環境変数名・リポジトリ規約を記入する。
4. **互換確認**: `docs/08_profile_switching.md` の互換マトリクスで backend×infra が supported か
   確認する。unsupported / caution なら構成を見直す。
5. **compose 確認**: docker compose 構成を確認する。無ければ最初の feature-contract として
   「開発環境のコンテナ化（web / api / db）」を切る。
6. **CI 配線**: 選択中の backend profile の「CIテストジョブ例」をもとに CI ワークフローを
   作成または更新する。CI 確認結果は `harness/evidence/<feature-id>/ci-status.md` へ記録する。
   CI 確認ができない環境では、ローカルのフルテストログ + 人間の CI 確認を代替証跡にできる。
   **CI 未確認のまま completed / deployable にしてはいけない**（`rules/30`）。
7. **hook 有効化確認**: `.claude/settings.json` の PreToolUse hook が読み込まれることを確認する。
8. **スモーク**: Claude Code / Codex では「有効な profile 構成を報告せよ」と聞き、未選択
   profile が混ざらないこと、hook が未選択 profile の Read をブロックすることを確認する。
   このとき、選択中の `ui_profile`（デフォルト shadcn/ui）だけが参照され、未選択 UI profile
   （例: MUI を選んでいなければ `mui.md`）に言及しないことも確認する。
   Copilot / Gemini CLI など hook のない系統では、各ツールの主指示を読ませたうえで
   「有効な profile 構成を報告せよ」と依頼し、未選択 profile に言及しないことを確認する
   （機械的な読込防止 hook がないため、行動規約ベースの確認になる）。
9. **運用開始**: sprint-contract を作成し、feature 単位で Planner から回す。
   凍結契約は `harness/contracts/<feature-id>.md`、実行証跡は
   `harness/evidence/<feature-id>/` に置く（`rules/30`）。

### ツール別の最初の実行例

最初の feature 開発は、Planner に feature-contract を作成させるところから始める。

- **Claude Code**: `/plan-feature` を実行し、「この要件で feature-contract を作って」と依頼する。
- **Codex**: `.agents/skills/plan-feature/SKILL.md` の手順に従い、「この要件で
  feature-contract を作って」と依頼する。
- **GitHub Copilot**: `.github/prompts/plan-feature.prompt.md` をプロンプトとして実行する。
- **Gemini CLI**: `/plan-feature` カスタムコマンドを実行する。

作成された feature-contract は `harness/contracts/<feature-id>.md` へ保存する。

## Codex を使う場合

- コピー対象に `AGENTS.md`（Codex 主指示）と `.agents/skills/`（Codex 用 skills）、
  `.codex/`（Codex 設定・hook）も含める。
- **既存プロジェクトに既に `AGENTS.md` がある場合は上書きせず**、既存の指示と
  本ハーネスの規約（未選択 profile 読込禁止・証跡ベース判定・Docker 必須）をマージする。
- Codex hook の有効化には Codex 側の hooks 設定と trust 確認が必要（`.codex/README.md`）。
- `.claude/active-profile.md` / `.claude/project-profile.md` / `.claude/rules/` /
  `.claude/profiles/` は Claude Code / Codex 共通資産なので二重管理しない。

### skills の同期規約（正本: `.claude/skills/`）

- Codex 用 skills は `.agents/skills/` に置く。`.agents/skills/` は `.claude/skills/` の
  **複製**として扱い、正本は `.claude/skills/` とする。
- `.claude/skills/` を変更した場合は、必ず `.agents/skills/` へ同内容を反映する。
  `.agents/skills/` を変更した場合も、必ず `.claude/skills/` へ同内容を反映する。
- 適用前またはコミット前に、以下で同期確認する。差分がある場合は、意図した差分でない限り
  コミットしない。

  ```bash
  diff -r .claude/skills .agents/skills
  ```

### hook の同期規約

- `.claude/hooks/guard-active-profile-read.js` と
  `.codex/hooks/guard-active-profile-read.js` は同じ allowlist 抽出思想で維持する。
- hook を変更した場合は両方の hook の挙動差分を確認する。少なくとも
  **`*_profile:` 行だけを allowlist 抽出対象にする**仕様が両方で守られていることを確認する。

## GitHub Copilot を使う場合

- コピー対象に `.github/`（`copilot-instructions.md` / `instructions/` / `prompts/` /
  `agents/`）を含める。
- **既存 `.github/copilot-instructions.md` がある場合は上書きせずマージ**する。
- 既存の `.github/instructions/` / `.github/prompts/` / `.github/agents/` がある場合は、
  同名ファイルの差分を確認してから統合する。
- Copilot 利用時も `.claude/active-profile.md` を有効構成の**正**とし、未選択 profile を
  読まない（Read / Grep / Bash 経由を問わず）。
- **Copilot には読込ガード hook が存在しない**（Claude Code / Codex の hook 相当の機構なし）。
  未選択 profile 読込禁止は指示（copilot-instructions / instructions）だけで担保されるため、
  hook を持つ系統（Claude Code / Codex）より防御レベルが低いことを認識して運用する。
- `.github/agents/*.agent.md` の `tools` 名は Copilot のサーフェス（VS Code チャット /
  coding agent）とバージョンで異なる場合がある。動かないときは利用環境のツール一覧に
  合わせて調整する（職掌分離 = generator のみ編集可、は維持する）。
- `.github/instructions/` の `applyTo` は既定で `"**"`（全ファイル適用）。採用先の
  ディレクトリ構造が確定したら、frontend / backend / infra は対象パスに絞ることを推奨する。
- Copilot 用ファイルを変更した場合は、`CLAUDE.md` / `AGENTS.md` / `.claude/rules/` との
  整合を確認する。

### 系統間の同期規約（Claude Code / Codex / Copilot）

`.github/` は正本を持たず、共通資産を参照する入口。以下を必ず一致させる。

- `.github/copilot-instructions.md` は `CLAUDE.md` / `AGENTS.md` / `.claude/rules/` と
  矛盾させない。
- `.github/prompts/` は `.claude/skills/`（正本）・`.agents/skills/` と目的・手順を
  ズレさせない。
- `.github/agents/` は `.claude/agents/` と職掌分離（generator だけが実装変更、
  evaluator / security-reviewer / release-judge はコード修正禁止）をズレさせない。
- **ReleaseJudge 専権・証跡ベース判定・未選択 profile 読込禁止・Docker 適用範囲**の 4 点は、
  Claude Code / Codex / Copilot / Gemini CLI の全系統で必ず一致させる。

## Gemini CLI を使う場合

- コピー対象に `GEMINI.md`（主指示）と `.gemini/`（`settings.json` / `README.md` /
  `commands/`）を含める。
- **既存 `GEMINI.md` がある場合は上書きせずマージ**する。
- 既存の `.gemini/settings.json` / `.gemini/commands/` がある場合は、同名ファイルの差分を
  確認してから統合する。
- Gemini CLI 利用時も `.claude/active-profile.md` を有効構成の**正**とし、未選択 profile を
  読まない（Read / Grep / Bash / @ 参照を問わず）。
- **Gemini CLI にはこの構成では読込ガード hook を同梱しない**（Claude Code / Codex は hook を
  持つ）。未選択 profile 読込禁止は `GEMINI.md` と `.claude/rules/00-reading-order.md` の
  行動規約だけで担保されるため、防御レベルが低いことを認識して運用する。
- `.gemini/settings.json` は推測キーで壊さないため現状 `{}`。設定追加は Gemini CLI の
  `/settings` または公式ドキュメントに従う（説明は `.gemini/README.md`）。
- Gemini CLI 用ファイルを変更した場合は、`CLAUDE.md` / `AGENTS.md` /
  `.github/copilot-instructions.md` / `.claude/rules/` との整合を確認する。

### 系統間の同期規約（Gemini CLI の追加分）

- `GEMINI.md` は `CLAUDE.md` / `AGENTS.md` / `.github/copilot-instructions.md` /
  `.claude/rules/` と矛盾させない。
- `.gemini/commands/` は `.claude/skills/`（正本）・`.agents/skills/`・`.github/prompts/` と
  目的・手順をズレさせない。
- Gemini CLI の sub-agents は preview 扱いのため、初期版では `.gemini/agents/` を作らない。
  ロールの職掌分離は `.claude/agents/`・`.github/agents/` を正として参照する。

## 既存 `.claude/` とのマージ

既存プロジェクトにすでに `.claude/` や `CLAUDE.md` がある場合の安全な適用順序:
**コピー前にバックアップ → 差分確認 → settings.json の hooks 節を統合 → CLAUDE 方針を統合 →
active-profile / project-profile を記入**。

- 既存の `.claude/settings.json` がある場合は上書きせず、本ハーネスの hooks 設定
  （PreToolUse の Read|Grep エントリ）を既存の hooks 節へマージする。
- 既存のルート直下 `CLAUDE.md` がある場合は上書きせず、既存方針とハーネス方針を
  読み比べて統合する。
- 既存の `.claude/CLAUDE.md` がある場合は、**ルート直下 `CLAUDE.md` を正**として内容を
  統合し、`.claude/CLAUDE.md` は削除して重複させない（両方に実体を残すと二重に
  読み込まれ、矛盾の温床になる）。
- 既存 hooks がある場合は、hook の実行順序と責務を確認する。
- 既存 `.claude/agents/` や `.claude/skills/` がある場合は、同名ファイルの上書き前に
  差分確認する。

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
