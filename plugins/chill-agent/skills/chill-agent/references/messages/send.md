---
keyPoints: >-
  Deliver what the user needs to receive, with enough context to use or decide.
  Letters ask for necessary replies; Comments carry results and progress.
---

# Send a message

Use a Letter only when the user needs to answer, choose or grant permission.
Use a Comment for requested findings, completed artifacts and progress; keep
the current explanation in the Brief. Do not turn a report into a question or
ask for acknowledgement just to leave a Letter open.

Lead with the result, evidence, artifact link and limitations needed to use it.
For a real decision, explain the next proposed action, your recommendation and
what the answer changes. Check recent Conversation, including answered and
closed Letters, to avoid repeating either a report or an existing question.
A result already delivered in a Comment needs no replacement Letter.

For a consequential choice that belongs to the user, investigate available facts
and prepare enough authorized work to make your recommendation concrete. Explain
what the answer changes. A pending final folder, name or similar reversible
detail often allows the same artifact to be built and checked provisionally;
record that assumption and continue. A Letter is not permission, but neither is
it a pause on everything. Keep explicit waits and missing authorization limited
to their actual dependencies.

Save beside the Goal with `goal letter --title ...` or `goal comment`, using
`--text-file` for longer messages and installed help for syntax. Verify the saved
event. Keep the current explanation in the Brief; saving a message changes
neither work selection nor Goal completion.

For a saved Letter, use `settings notice --id <goal> --event <event>` with the
stable prefix. Web alerts are Letter-only. A handled or web-push response means
the extension handled delivery; do not send again. Otherwise, when enabled,
use the exact returned host tool, recipient and message once, then its receipt
command for sent, failed or unconfirmed. Disabled or uncertain delivery is not
permission to switch routes or retry. Acceptance does not prove the user saw it.
Use installed help for syntax or current settings when needed; do not alter
notification preferences as part of reporting.

Continue authorized work without waiting for an answer that it does not need.
An AutoContinue pass with no new outcome or remaining work has only its internal
no-work receipt, not another result message.
