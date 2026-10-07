---
keyPoints: >-
  Connect through the calling harness and reuse its stable runtime prefix. Claude
  needs its explicit native setup and main-hook actions; Codex remains the default.
---

# Connect the current conversation

Use this when starting chill-agent or repairing its entry. Keep the conversation
and context in the harness the user is already using. A project directory or
saved Goal does not authorize handing its work to a different conversation.

Reuse the exact stable CLI prefix from setup or incoming feedback. With no known
prefix, resolve the installed plugin root two directories above this Skill's
folder, then read `node '<plugin-root>/bin/chill-setup.mjs' --help`. Inspect
existing settings and server status before preparing again.

Inside **Claude Code**, read [Use the native Claude connection](claude-code.md)
before setup, Root creation or feedback receipts. Its experimental main-hook
route differs from Codex's Queue and execution tracking.

Inside **Codex Desktop**, use the default setup route from installed help and
the [CLI guide](use-cli.md). A new or changed Codex hook may require the user's
native `/hooks` review; never treat a successful settings write as that review.
Other harnesses need a verified connection; a missing path is not a reason to
launch Codex or Claude as a replacement for the current conversation.

Start or reuse the local Web server with its installed help when needed. Server
startup, public access and external notifications are separate choices. Preserve
existing ports, data directories and remote-access settings.
