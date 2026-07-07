# .codex/ — Codex 用設定

## 目的

この共通開発ハーネスを Codex でも Claude Code と同じ品質で運用するための、
Codex 側の入口設定を置くディレクトリ。

## 構成

- **主指示はリポジトリルートの `AGENTS.md`**。Codex はまずこれを読む。
- **Codex 用 skills は `.agents/skills/`**（`.claude/skills/` と同等の 11 skill）。
  `.agents/skills/` は `.claude/skills/` の**複製**として管理し、**正本は `.claude/skills/`**。
  両者を乖離させない。更新時は `diff -r .claude/skills .agents/skills` で一致確認する。
- 以下は **Claude Code / Codex の共通資産**であり、どちらのツールでも同じものを使う:
  - `.claude/active-profile.md`（有効な技術構成）
  - `.claude/project-profile.md`（プロジェクト固有情報）
  - `.claude/rules/`（共通ルール）
  - `.claude/profiles/`（技術選択別ルール）
  - `harness/contracts/`（凍結契約）・`harness/evidence/`（実行証跡）

## hook の有効化

- 未選択 profile 読込ガード: `.codex/hooks/guard-active-profile-read.js`
- Codex で hook を有効化するには、**Codex 側の hooks 設定と trust 確認が必要**
  （Codex 内の /hooks から trust・有効化する）。hook 設定形式はバージョンにより
  異なるため、`config.toml` には推測の設定キーを書いていない。
- 単体検証（hook 配線前でも動作確認できる）:
  ```bash
  node .codex/hooks/guard-active-profile-read.js .claude/profiles/backend/django.md
  # 未選択なら exit 2 + 理由表示、選択済み/対象外なら exit 0
  ```

## 限界

- **Bash 経由の読込（`cat` / `sed` / `awk` など）は hook だけでは完全に防げない。**
  そのため `AGENTS.md` と `.claude/rules/00-reading-order.md` で、手段を問わず
  未選択 profile を読まないことを禁止事項として明記している。hook は防御の一層であり、
  行動規約との二重防御で運用する。
