# DfE Digital Standards - Claude Code — Claude Code

> Provisioned by the AI Provisioning Platform. The substantive
> instructions live in `AGENTS.md` (cross-tool standard); this file
> imports them and adds Claude Code-specific layering info.

@./AGENTS.md

## Claude Code-specific notes

- **Settings layering** (lowest → highest priority):
  1. `~/.claude/settings.json` (your personal default)
  2. `./.claude/settings.json` (committed; team baseline)
  3. `./.claude/settings.local.json` (gitignored; your overrides)
  Permission `allow`/`deny` arrays merge across layers; `deny` always
  wins. The team baseline blocks the riskiest commands by default —
  don't weaken it without thinking about why it was there.
- **Skills** live at `.claude/skills/<slug>/SKILL.md` (Agent Skills
  open standard — also auto-discovered by Copilot CLI, Cursor, Codex,
  etc.). The `platform-conventions` skill is pre-installed for
  on-demand recall of the rules in `AGENTS.md` / `docs/PLATFORM.md`.
- **MCP servers** wired into this repo are in `.mcp.json`. Auth via
  env vars or OAuth — never directly in the file.
- **Attribution:** commits made via Claude Code carry
  `Co-Authored-By: Claude` per `.claude/settings.json`.

## Need help

Reach out to the platform team. See `AGENTS.md` for full conventions.
