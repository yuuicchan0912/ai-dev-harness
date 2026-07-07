# .gemini/ — Gemini CLI 用設定

## 目的

この共通開発ハーネスを Gemini CLI でも他系統と同じ品質で運用するための、Gemini CLI 側の
入口設定を置くディレクトリ。**正本は増やさず**、共通資産を参照する。

## 構成

- **Gemini CLI 用の主指示はルート直下の `GEMINI.md`**。
- **Gemini CLI 用のプロジェクト設定は `.gemini/settings.json`**。
  正確な設定キーを推測で書いて壊すことを避けるため、現状は空オブジェクト `{}`。
  追加設定が必要になったら、Gemini CLI の `/settings` または公式ドキュメントに従って
  正しいキーで更新する（JSON はコメント不可なので、説明はこの README に置く）。
- **Gemini CLI 用のカスタムコマンドは `.gemini/commands/`**（TOML 形式、7 個）。

## 共通資産（4 系統で共有）

以下は Claude Code / Codex / GitHub Copilot / Gemini CLI の**共通資産**であり、
どのツールでも同じものを使う:

- `.claude/active-profile.md`（有効構成）・`.claude/project-profile.md`（固有情報）
- `.claude/rules/`（共通ルール）・`.claude/profiles/`（技術選択別ルール）
- `harness/contracts/`（凍結契約）・`harness/evidence/`（実行証跡）

## コマンドの同期

- `.gemini/commands/` は `.claude/skills/`（skill 正本）・`.agents/skills/`・
  `.github/prompts/` と**目的・手順をズレさせない**。変更時は 4 系統の整合を確認する。

## 未選択 profile 読込防止（重要）

- **Gemini CLI にはこの構成では未選択 profile 読込を機械的に止める hook を同梱しない。**
  Claude Code / Codex は PreToolUse hook を持つが、Gemini CLI は行動規約のみで担保する。
- したがって未選択 profile 読込禁止は `GEMINI.md` と `.claude/rules/00-reading-order.md`
  で禁止し、例外なく厳守する。4 系統の中で防御レベルが低いことを認識して運用する。

## 将来の拡張

- Gemini CLI extension 化する場合は、`gemini-extension.json` と commands / skills /
  agents / policies のパッケージ化を検討する。
- Gemini CLI の sub-agents は preview 扱いのため、**初期版では `.gemini/agents/` は作らない**。
  ロールの職掌分離は `.claude/agents/`・`.github/agents/` を正として参照する。
