---
keyPoints: >-
  Explicit project setup preserves native permissions. Keep the same conversation
  on resume; main Bash hooks confirm Root creation and feedback receipts. No live
  controls, implicit reassignment or permanent idle reception are promised.
---

# Use the native Claude connection

Use this inside Claude Code. The experimental connection keeps the user's work
in this main conversation. Reuse its prepared command prefix and data directory.
When none is known, use the bundled first-use starter from
[Connect this conversation](connect.md) with `--harness claude-code`.
Never use the Codex default for this route. Claude's local settings may live at the main Git
repository root, so identify the directory Claude uses before writing them.

Setup adds only its own recorded project hooks. It preserves native permissions,
other hooks and hook disablement. It does not enable Auto mode. Native hook
review and SessionStart still need to occur. From the main Bash tool, use
`connection show` to check the identity handoff. If it is missing, preserve the
work and explain the native exit-and-resume step for **this same conversation**.
Do not clear, fork, fabricate identity variables or launch a second writer to
repair it. Settings being present does not prove a live connection.

## Start and resume work

Follow [Create a Goal](../goals/create.md) for the agreement. Create a **new Root**
with `connection create-goal --help`; use `goal create --parent <ID>` for a child
of that Root. An existing Root's connection cannot be reassigned. Before continuing
an existing native Root, compare its stored connection with `connection show`;
both session and context must match. A mismatched connection is not permission
to adopt its work.

Run each connection action as a separate main Bash call, preserving its stdout.
Its printed request marker is pending; the main PostToolUse hook confirms the
saved result. If confirmation is missing, inspect `connection request --id <ID>`
and use the same request's supported recovery. Do not create another Root or
repeat an uncertain receipt. Resume preserves context; clear and fork do not.

Ordinary Goal reads, updates, Briefs, Comments and Letters use the shared CLI.
`goal work` and Codex's live execution controls are not supported on this route;
choose the Goal through its current context without inventing a work heartbeat.

## Receive feedback and continue

Use `connection inbox` to recover pending input in this conversation or establish
a fresh verified prompt. Once confirmed, ordinary tool hooks receive new input
across its Goals during that prompt. Read later corrections before acting. Record
`connection activity --event <ID> --state working`, then `completed` or `failed`
when handled, waiting for each main-hook confirmation. Keep uncertain offers and
manual holds intact. There is no native `deferred` Queue receipt here; do not use
Codex's Queue commands or promise that an unclaimed event will start by itself.

Optional Auto mode commands are available from `monitor --help` in the composed
runtime and also require main-hook confirmation. Use the
[combined continuation guide](../auto-mode/continue.md) for its next action.
Here Pause holds future continuation; it does not interrupt Claude. Setup does
not enable the mode or grant more native tool permissions.

An explicitly selected `--idle-watch-ms` at setup adds a finite feedback watch
after a verified response ends. It expires without renewal; a closed conversation
cannot receive through it. Do not promise unattended overnight reception. Model
settings, usage, live status and execution cancellation remain unavailable through
chill; use Claude's own supported controls for those needs.
