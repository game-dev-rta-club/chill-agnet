---
keyPoints: >-
  AutoContinue is opt-in per root Goal and sends one combined continuation and stopping
  review per meaningful change. Turning it off preserves history and does not interrupt already queued work.
---

# Help the agent pick up the next step

AutoContinue asks the agent to revisit the agreed work after its run ends. It
does not decide what the project should become or guarantee that every Goal is
finished. The agent still needs to read the relevant work, act and check results.

## Turn it on when you want it

Choose **More → AutoContinue**, then use On / Off. Opening
the panel does not change the setting. It belongs to the root Goal and is
shared by its children. A root must have an assigned chat.
Installation does not turn monitoring on.

This guide describes the supported Codex integration. The development-only
[Claude Stop-hook route](../development/claude-auto-mode.md) has separate commands
and qualification limits; these Web controls do not yet configure it.

The Agent menu also keeps the compact AutoContinue switch. Header
panels use the same interaction as Notifications and Public link. Older CLI
builds may have a direct header toggle; the monitor policy is independent of
that presentation.

Turning it off stops future automatic requests. It does not cancel one already
queued or interrupt a running agent. Use the agent's Pause control for that.
Turning it off and on again does not reset the attempt allowance.

## What triggers a check

The Web server checks at startup and on its 30-second cycle. A request waits
until the assigned run has ended and there is no pending delivery, native queue
or manual pause. Uncertain state also waits. The host checks again just before
sending, so a newly queued message can prevent the automatic request.

The monitor allows **one request per meaningful change**. User feedback and
substantive Goal or Brief changes create a new allowance
after any unresolved request is accounted for. Ordinary agent comments,
heartbeats, identical saves and internal no-work results do not.

After that request, monitoring rests until another relevant change. A reported
result alone does not prove the run ended; the monitor waits for execution
evidence before sending again. The allowance and unresolved requests survive
server restarts.

## What the agent receives

The request describes what remains and points to a short Goal index. Unfinished
Goals lead to an unfinished-work query; completed Goals with unanswered questions
lead to Letters. When all Goals are Done and no Letter is open, it asks for a
concrete omission and otherwise leaves the project at rest. Older CLI versions
use their supported compact tree command.

The request states that Auto mode is On and links directly to the packaged
`references/auto-mode/continue.md`. The agent compares the original outcome
with actual results, then checks any reason to stop in the same pass and acts
on remaining entrusted work. Results belong in Comments. If a next step needs a user decision, the agent
asks in a Letter with a concrete proposal and recommendation. It does not turn
a report into a Letter or treat reporting as a reason to stop. There is no second request to
repeat that review.
It opens a relevant Goal through the compact context view, then follows Brief
and question links as needed. User acknowledgement is not a condition for
continuing. The request does not expand the agreement or override a later
Off setting or manual pause.

## See what happened

Open **Agent → Activity → Recent runs**. Each new check is linked to the Goal
selected most recently when the check was sent (or the Root if none was selected).
The link is saved with that run, so later work selections do not move its history.
**Run log** loads the public agent output and saved request on demand. It creates
no Conversation message. Old runs without a saved Goal association stay readable
without inventing a past work target.

The AutoContinue count still describes pending or running checks. Finished checks
remain in Activity; Off does not erase them. The redundant AutoContinue History
view is no longer shown.

“No work reported” is the agent's report, not proof of project completion.
Actual work and decisions belong in the usual Brief, Comment or Letter. A
no-work result returns through the monitor's internal command without posting
another Web message that could disturb a resting project.

For command details, run `chill monitor --help` with the stable command from
setup. Implementation: [monitor policy](../../lib/continuation-monitor.mjs) and
[activity projection](../../lib/continuation-extension.mjs). The host's delivery
contract lives in the [CLI guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/extensions/requests.md).
