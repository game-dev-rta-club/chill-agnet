---
keyPoints: >-
  Use installed help and the supplied stable prefix. Feedback receipts, explicit
  work selection and Goal completion are separate operations.
---

# Use the CLI

Use this when receiving feedback or changing the workspace. Reuse the exact
stable CLI prefix supplied by setup or incoming feedback; consult its help and
the relevant subcommand's help for supported syntax.

Read the [connection interface](connect.md) when you need Root creation,
feedback receipts or work selection. Use its operation command with the stable
prefix and follow its confirmation rule. Missing capabilities must not be
replaced with another host's command or assumed success.

Read incoming feedback before choosing a supported receipt. Skip already
completed work while checking the rest. Record completion or failure only for
work actually handled. A receipt neither selects a work Goal nor completes it.
Use the interface's work-selection operation when available; otherwise continue
from the current Goal context without fabricating an execution heartbeat.
Reopen a Done Goal only when actual work remains. Preserve manual pauses and
record a waiting reason only when work genuinely cannot advance.

Use the short `goal review` index and the relevant `goal show` sections to find
information. Their printed commands lead to older discussion and longer Briefs.
Use file input where supported for longer writes; verify a successful response
before saying a Comment, Letter, Brief or metadata change was saved.

Local work needs neither messaging nor remote access. Optional notifications
are configured in **More → Notifications**, and phone access in **More → Public
link**. The Public link guide covers permissions and fixed URLs. Inspect
existing settings and server status before running setup again.
