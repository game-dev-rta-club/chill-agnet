---
keyPoints: >-
  Read the whole feedback bundle before acting, select actual work explicitly,
  and keep questions and current explanations on the Web. Receipts and replies
  do not prove a Goal is complete.
---

# Work through the shared Web

Use the stable CLI prefix from the incoming request or setup. Follow its help
for exact syntax; consult the relevant command rather than loading every manual.

## Receive and select work

Read bundled feedback in order before acting, applying later corrections from
the start. Follow the supplied activity instructions for each message. Skip
already completed work while still checking the remaining messages. If all are
complete, do not repeat the work or post another reply. Read the indicated Goal,
answered Letters and referenced Brief versions when interpreting annotations.
Preserve other Goals' queues and explicit pauses.

A work selection names the Goal you are advancing in this turn; it does not
change its completion state. Before resuming actual work on a Done Goal, reopen
it to Idle using `goal update` (see its installed help). Then select it with
`goal work --id <GOAL>`. Select again when moving to another branch. Receipts and
Comments do not select work. Record a waiting reason only for work that
genuinely cannot advance.
Execution indicators such as Running or Paused are separate from saved Goal
completion; do not infer success from a stopped execution.

For a workspace overview, use the short index available in installed help:
`goal review` with a relevant filter, or `goal tree` on older versions. Open a
selected Goal with `goal show`, following its printed commands for older
conversation or more content when needed. Avoid reading every history by default.

## Keep the explanation and questions current

Edit the existing Brief source and publish it with `goal brief update`. Lead
with the outcome and current shape; use headings for supporting detail. Progress
logs belong in Comments. Markdown and HTML options are described in the Brief
commands' help.

Deliver an ordinary reply with `goal comment`, or a question with `goal letter`. Give a Letter
a short title that names the decision. File input avoids shell quoting problems
for longer text; inspect each command's help for its supported input option.

A Letter reply can close its item in the Web list automatically. Ordinary
comments do not. Recheck the question and current discussion before manually
using `goal close-letter`; close it only when no further user reply is needed.
Closing acknowledges the question, not authorization or completion. If a reply
leaves a necessary question unanswered, send a focused follow-up Letter rather
than silently treating the matter as resolved.

Verify successful writes before reporting that the Web has been updated. Keep
brief acknowledgements in Conversation when useful; do not ask the user to
confirm routine recordkeeping.
