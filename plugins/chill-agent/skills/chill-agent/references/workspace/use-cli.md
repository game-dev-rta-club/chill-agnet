---
keyPoints: >-
  Use installed help and the supplied stable prefix. Feedback receipts, explicit
  work selection and Goal completion are separate operations.
---

# Use the CLI

Use this when receiving feedback or changing the workspace. Reuse the exact
stable CLI prefix supplied by setup or incoming feedback; consult its help and
the relevant subcommand's help for supported syntax.

For Claude Code, use the [native connection guide](claude-code.md) for Root
creation, receipts and work selection. The Queue and `goal work` operations below
apply to Codex Desktop. Reads and ordinary workspace writes are shared.

Read incoming feedback before choosing its activity receipt. `deferred` records
reading an independent later request while preserving a confirmed Queue entry;
`working` claims it and removes that entry. See [Receive feedback](../work/receive-feedback.md). Skip already
completed work while still checking the rest. Record `completed` when the
requested work is finished, or `failed` if it could not be completed. Receipts
neither select the work Goal nor mark it Done.

Select actual work with `goal work --id <GOAL>` at the beginning and when changing
branches. If a Done Goal has actual work to resume, first reopen it with
`goal update`. Record a waiting reason only when work genuinely cannot advance.
Running and Paused describe execution separately from saved completion.

Use the short `goal review` index and the relevant `goal show` sections to find
information. Their printed commands lead to older discussion and longer Briefs.
Use file input where supported for longer writes; verify a successful response
before saying a Comment, Letter, Brief or metadata change was saved.

Local work needs neither messaging nor remote access. Optional notifications
are configured in **More → Notifications**, and phone access in **More → Public
link**. The Public link guide covers permissions and fixed URLs. Inspect
existing settings and server status before running setup again.
