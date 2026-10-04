# Continuation monitoring — working draft

Status: continuation behavior and progressive reading updated through Goal #34 (2026-10-05).
The revised monitor, two-nudge limit, 30-second polling and dedicated result
route are implemented in development source. This wording remains a draft for
final polishing. Check installed CLI help before use.

## Purpose and boundaries

Ask an idle Agent to find work it can advance within the user's agreed purpose.
An unanswered Letter does not rule out independent work. Even when every Goal
is Done, check for missing work needed to fulfill the agreement; add a Goal
when justified by that agreement, not merely to keep the monitor busy.
Do not expand the agreed scope or override a user's stop instruction.

The intended separation is:

- chill-agent-cli owns data, Web, harness observation and delivery.
- chill-agent owns the skill, server startup orchestration and monitor policy.
- Monitor requests and their results travel monitor → Agent → monitor.
  They are not user feedback and do not create Web Conversation messages.

## Checking and counting

- Check every 30 seconds using one polling loop. Do not
  also add event-driven checks. Send when the conditions are met, without the
  previous fixed two-minute idle window or five-minute follow-up delay.
- Do not exclude work because of Goal state or an unanswered Letter.
- Check the assigned chat's running turn, pending deliveries, complete queue,
  and explicit pause. Uncertain state or receipt must not produce duplicate work.
- Send at most **two total nudges** since the last relevant change. The first
  nudge counts as 1; the second is the final check for that revision.
- Relevant changes include user feedback and substantive Goal/Brief updates.
  Identical saves and bookkeeping timestamps do not reset the count.
- Monitor requests/results, delivery updates, heartbeats and Agent reply
  comments alone do not reset it. Persist counts across monitor restarts.
- A no-work response consumes its nudge; it does not suppress the second check
  or start a fresh allowance. Confirm actual turn completion and an empty queue
  before sending again. A result callback alone does not prove the turn ended.

## Reading the workspace and responding

The incoming nudge states the observed workspace situation and supplies a query:
unfinished Goals, only pending Letters when all Goals are Done, or the whole
index when all Goals are Done and no Letter awaits an answer. These are saved
facts, not proof that the agreed outcome has been achieved.

Use that short index to choose the relevant Goal, then read its current Brief,
success criteria and recent discussion. Follow the printed continuation commands
when older history or more Brief text is needed. Do not begin by concatenating
every Goal's full history. Installed CLI help is authoritative; older runtimes
may provide `goal tree` instead of the new filtered `goal review`.

Continue agreed work where possible. When an outcome has been achieved, complete
that Goal after checking its criteria and descendants. If a user decision is
needed, send a Letter rather than keeping the question only in chat. Avoid
repeating a question already waiting for the user and continue independent work.

For actual results or necessary decisions, use the usual Brief, Comment and
Letter workflow. For no additional work, return the result through the monitor
command without posting a no-work Comment, Letter or Brief edit. There is no
additional stop-reason report or automatic review of the no-work judgment.

The incoming request includes the exact command:
`monitor result --id <ROOT> --attempt <UUID> --outcome worked` or
`--outcome no-work`. It requires the assigned chat's CODEX_THREAD_ID.
This records a result only; the monitor separately verifies turn completion.
If the command is unavailable, do not claim success or replace it with an
automatic no-work Web comment. Ordinary user feedback still receives its normal
response.

Both nudges use English, with saved Goal and Letter titles kept in their original
language. The second makes the consequence of overlooking agreed work clear,
without adding more reading requirements, a visible attempt counter, or authority
to expand scope. Queue, pause and two-nudge safeguards remain unchanged.
