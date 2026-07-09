# 01 — ハーネスアーキテクチャ

## 読み込み順序

1. `CLAUDE.md`（リポジトリルート。Claude Code の主指示）
2. `.claude/active-profile.md`
3. `.claude/project-profile.md`
4. `.claude/rules/`
5. `.claude/active-profile.md` で指定された profile のみ（frontend / ui / backend / infra / docker / testing）

`rules/00-reading-order.md` が正本。未選択 profile の読込は PreToolUse hook で禁止。
UI ライブラリは `ui_profile:` で選択する（デフォルト shadcn/ui、MUI は明示切替）。読み込むのは
`ui_profile:` が指す 1 ファイルのみで、未選択 UI profile は読まない。

## 各層の責務

- **CLAUDE.md（リポジトリルート）**: Claude Code の主指示。最優先の共通方針
  （読み込み順・フロー・TDD・Docker・completed 権限）。Codex の主指示は `AGENTS.md`（並列の入口）。
- **rules/**: 技術非依存の共通ルール（番号順に 00〜70）。
- **profiles/**: 技術選択別ルール。固定見出しで揃え、skill が見出し名で参照できるようにする。
- **agents/**: Planner / Generator / Evaluator / SecurityReviewer / ReleaseJudge の subagent 定義。
  frontmatter で tools / model を制限する。
- **skills/**: 各工程の手順書。技術固有コマンドは書かず profile を参照する。
- **project-profile.md**: 固有情報の唯一の置き場。

## 関係（テキスト図）

```
CLAUDE.md
  └─ active-profile.md ──┐
                         ├─ profiles/<選択されたものだけ>
project-profile.md ──────┘
rules/*  ← すべての agent / skill が従う共通ルール
agents/* ← 各段の責務・ツール権限・禁止事項
skills/* ← agent が使う手順（profile を見出し参照）
harness/evidence/<feature-id>/ ← 全工程の証跡の置き場
```

## ツール権限による強制

- 実装変更は Generator のみ（Edit / Write / Bash を持つ）。
- Evaluator / SecurityReviewer / ReleaseJudge は Edit / Write を持たない（コードを触れない）。
- レポートは各 agent が本文出力し、メインエージェントが証跡ファイルへ保存する
  （保存時に許可される変更は Markdown 整形・パス追記・日時追記のみ、判定は改変しない）。

## 証跡の一元化

すべての判断材料は `harness/evidence/<feature-id>/` に集約する。ReleaseJudge はここだけを
根拠に判定する（`rules/30` / `rules/70`）。
