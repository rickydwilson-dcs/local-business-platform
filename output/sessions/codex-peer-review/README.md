# Codex Peer Review Folder

This folder stores Codex's planning output when running the dual-model peer review workflow.

## How It Works

For complex architectural or multi-step implementation tasks, we send the same problem brief to both Claude and Codex independently, then ask Claude to synthesise the two plans into a single best-of-both spec.

**Why:** Claude tends toward elegant abstractions that can miss operational constraints. Codex tends toward implementation-first thinking that can miss architectural coherence. The synthesis catches blind spots from both.

**Proven on:** Theme architecture (Feb 2026) — Codex caught the Server Component/React context constraint that Claude's initial plan overlooked.

## File Naming

Each review lives in a subfolder matching the session it belongs to:

```
codex-peer-review/
  YYYY-MM/                              ← monthly bucket (e.g. 2026-04/)
    YYYY-MM-DD_topic-name/
      codex-plan.md       ← paste Codex's raw output here
      synthesis.md        ← Claude's synthesised plan (becomes the session.md spec)
```

## Workflow

1. Run `/plan.with.codex` in Claude Code — it writes the problem brief to a new subfolder
2. Open Codex in VS Code, paste the brief from `codex-prompt.md`, copy the response into `codex-plan.md`
3. Return to Claude Code and run `/plan.with.codex synthesise` — it reads both plans and writes `synthesis.md`
4. Review `synthesis.md`, approve it, then implement using the normal session workflow
