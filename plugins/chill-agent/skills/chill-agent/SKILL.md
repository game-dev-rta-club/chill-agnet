---
name: chill-agent
description: Help the user agree on a goal, entrust the work to an agent, and review plans and results through chill-agent Web pages. Use when the user asks to start or continue work with chill-agent.
---

# Chill Agent

## What this is for

Chill-agent helps the user confidently leave more work to you. They should be
able to leave the screen, stop keeping the whole discussion in their head,
and return when there is something worth deciding.

Its CLI gives you and the user a shared Web page organized around a **Goal**. The user
can read it, comment on specific passages, and give feedback from the Web or
this chat. You can read the same content and conversation through the CLI.

Keep the **Brief** up to date as the shared explanation of the work. Use **Comments** to share progress and results, and **Letters**
for questions the user can answer when convenient. Build on that exchange: the user
can shape the direction through a few useful reactions, while you take
responsibility for figuring out the work needed to get there.

## Why agreement on the goal matters

If the user has to name every small task and approve every next step, they
still have to watch the work. Share a clear enough picture of the outcome
that you can make useful decisions and keep going within that agreement.

For example, “a game prototype to try a new control scheme” and “a game ready
for commercial release” call for very different work. Help make the purpose,
expected quality, scope, and practical limits clear. These are discussion
points, not a form the user must fill in. Some variation in interpretation is
natural; shared direction matters more than specifying every detail upfront.
A small goal may take minutes; a large one may call for sustained work over
days. Fit the ambition to the user's wishes and the host's actual capabilities.

Bring your own concrete ideas, including in domains the user knows less well.
If the user suggests A, investigate what else would make A useful and propose
A+B. Their feedback may add C, and your work may reveal D. This exchange should
reduce both the user's explanation burden and overlooked impacts. Leave room
for new ideas. Research and small experiments should resolve uncertainties
that could change the direction, without making agreement needlessly slow.

## A useful way to work together

1. **Make the starting idea concrete.** Understand the request and any existing
   Goal discussion. Offer an outcome the user can picture and react to.
2. **Shape a complete proposal together.** Help the user see what they would
   be entrusting to you and why it is worthwhile. Use their reactions to refine
   the direction. Show enough of the whole plan to judge it, with supporting
   detail available when useful. One proposal or several alternatives can work.
3. **Agree on what you will take on.** Make the transition from discussing to
   proceeding clear. Obtain a go-ahead for the agreed scope, reusing one already
   given. Agreement should make sustained work possible, not create a new gate
   for every small decision.
4. **Carry the work through.** Investigate, implement, check, and improve while
   staying within the goal. Adapt methods as you learn. The user can add an idea
   at any time; incorporate it without losing the work already agreed on.
   When one branch needs an answer, leave a Letter there and continue independent
   agreed work. A question does not by itself put the whole goal on hold.
5. **Return with evidence and a next idea.** Explain what changed, how you
   checked it, what remains uncertain, and what would help next. If the goal
   proves unreachable, the evidence is still a useful result: explain it and
   stop instead of silently replacing the goal. Let the user adjust the result,
   agree on a new goal, or finish when satisfied. Notify them when configured
   so they do not have to keep checking.

This is a guide to collaboration, not a fixed sequence for every request.
Trust grows through results: work progresses, missing pieces are considered,
and the user can resume without reconstructing the chat. Success is useful
work they can comfortably entrust to you, not just fewer messages or approvals.

## Using the shared workspace

Write in the user's language. A **Goal** holds the agreed outcome, scope and
success criteria. Create a **SubGoal** when discussion reveals another piece
with its own outcome to implement or verify. Small improvements are welcome as
SubGoals; they need not be ambitious. Keep related discussion with that piece
so the user can resume without following a long sequence of changing topics.

The **Brief** is the current explanation of that Goal: its plan, what has
been learned, and ultimately the result. Edit the same source as the
work develops, retaining useful context. Keep its opening short: what this Goal
will realize and its current shape. Put supporting detail under Markdown headings
(`##`, `###`); the Web folds these hierarchically. Tables, lists, code and Mermaid
code fences also render in Brief and Conversation. Brief can also be an HTML
artifact with inline CSS and SVG for a visual explanation. Select with
`brief path --id <GOAL> --format html`, edit that file, and publish with
`brief update --id <GOAL> --format html`. Use `--format markdown` to return to
Markdown; omission retains the current format. Both editable sources and their
history remain. HTML renders in an isolated static frame; scripts, forms and
remote assets do not run. Text and uploaded-image annotations share the same
editor. Keep progress logs in Comments. Its saved history is for reference,
not a place to introduce a different topic. New work with a separate outcome
belongs in a SubGoal.

**Conversation** belongs to the Goal and stays available across Brief updates,
even before a Brief exists. Send a **Comment** for information or an
acknowledgement that needs no answer. Send a **Letter** for a question you want
the user to answer, with a short title that makes the question clear in a list.
These are separate CLI commands; choose based on whether a reply is needed.

While working through chill-agent, save clarification questions, choices, and
requests for confirmation as a **Letter** on the relevant Goal. Chat-only question
tools such as `request_user_input` and `request_user_input_async` do not save a
question to the Web. Use them only when the user explicitly asks to answer there;
otherwise use `goal letter --id <GOAL> --title <TITLE> --text <QUESTION>` (or
`--text-file`) and optionally link the saved Letter in chat.

Letter answers use the same editor and draft list as annotations. Save keeps a
Letter annotation in the comment draft; Comment sends it on its own. A
successfully sent `kind: letter` annotation closes its target Agent Letter.
Ordinary comments and text/image annotations do not automatically close Letters.
Read the open Letters listed in Next Actions and the current discussion. Use
`close-letter --id <GOAL> --event <LETTER>` only when no additional user reply is
needed and keeping that Letter in the user's list no longer serves a purpose.
A comment arriving is not itself a reason to close. This marks the Letter Received
without inventing a user answer; its text and annotations remain saved. Read the
question and its answer together; an answer does not itself grant approval,
resolve a waiting condition, or complete a Goal. If a further answer is needed,
send a new Letter. Acknowledgements can remain ordinary Comments.

Keep the Goal name stable. Record a waiting reason when a branch cannot progress.
Verify the agreed outcome against its criteria before marking a Goal Done, and
record the evidence in its Brief and a Comment. Done requires all descendant Goals
to be Done too; their completion does not automatically complete the parent.
After completing a child, review ancestor criteria and mark only achieved Goals
Done. The CLI returns this reminder; it does not require changing a state.
Adding or moving a child under a Done parent, or reopening a child, returns Done
ancestors to Idle. Return a Done Goal to Idle explicitly before resuming work.
The Web shows Running, a confirmed Paused execution, Waiting, or Done, and leaves Open unmarked. Paused is an execution/feedback-hold indicator, not a stored Goal state. Its link returns to Activity. The user can pause queued feedback without editing its saved comments. A new comment in that same Goal resumes the held comments together as one input; Resume works without a new comment too. Read all bundled comments before acting, apply later corrections from the start, and skip only already completed work, not the entire batch. Other Goals remain in the native queue.
Progress counts completed leaves; Open is capped at 99%, never inflated by Done.
One Codex chat owns a Root Goal and receives
feedback for its descendants. Read the incoming Goal, answered Letters and any
referenced Brief history before acting on the feedback.

Register the Goal you are actually working on in the current turn; change it as
you move to another branch. Working combines this selection with Codex execution
evidence. Feedback receipt does not move your work target. Turn end, replying,
and Brief publication do not prove the outcome was achieved. A new turn needs a new work
selection; nothing here schedules an extra model turn on its own.

Use the CLI help as the source for operations, input formats, and examples.
Resolve the installed plugin root two directories above this Skill directory,
then begin with:

```sh
node '<plugin-root>/bin/chill-setup.mjs' --help
```

After preparation, setup returns a stable command prefix. Use that exact prefix as `<chill>`:

```sh
<chill> --help
```

Read only the help needed next: `goal`, `server`, or `settings`, then the
particular command's `--help`. At a new chat, read saved settings and check the
existing server so setup does not have to be repeated. For Web feedback, follow
the supplied receipt instructions; `goal activity --help` explains retries and
duplicate handling. For notifications, read `settings notice --help` for how to
retrieve fresh preferences before using the selected host sending tool.

Use `goal assign --help` for the Root owner and `goal work --help` for the current
work target. The project Hook refreshes liveness after tools; with stale or
unavailable evidence the Web stops showing Working. `goal tree` includes scope,
criteria, waiting reasons and the observed work target without all Brief bodies.

When the configured route is a Slack Reminder, use its reminder-creation tool
with the literal `time: "1 minute ago"` for the agreed workspace and authenticated
recipient. The tested connector scheduled it about one minute later; do not
promise immediate delivery or substitute a normal self-DM. Other routes follow
the method agreed during message setup. A successful API call confirms creation,
not that the user's device displayed a notification.

Core use works locally with messaging and remote access off. Offer
`chill-agent-message-setup` when the user wants those optional capabilities.

## Continuation monitoring — working draft

Read
[the continuation draft](references/continuation-draft.md) when designing or
handling monitor-initiated work. The wording remains a working draft; the revised monitor and
internal result command are implemented in the development source. Use the
installed CLI help and incoming request for available operations.

Runtime support is currently Codex Desktop on macOS with Node.js 20+; Claude
packages prepare the future structure only, without working Web callbacks.
