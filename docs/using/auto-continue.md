---
keyPoints: >-
  AutoContinue is opt-in per root Goal and sends at most two checks per meaningful
  change. Turning it off preserves history and does not interrupt already queued work.
---

# Help the agent pick up the next step

AutoContinue asks the agent to revisit the agreed work after its run ends. It
does not decide what the project should become or guarantee that every Goal is
finished. The agent still needs to read the relevant work, act and check results.

## Turn it on when you want it

Use the Auto-continue control beside the Agent icon. The setting belongs to the
root Goal and is shared by its children. A root must have an assigned chat.
Installation does not turn monitoring on.

Recent CLI builds show a coffee cup; compatible Agent menus also offer the same
On/Off control alongside activity history. The currently pinned CLI v0.1.0 uses
the older 24h header icon and does not include that history view. The monitor
policy is separate from these presentation changes.

Turning it off stops future automatic requests. It does not cancel one already
queued or interrupt a running agent. Use the agent's Pause control for that.
Turning it off and on again does not reset the attempt allowance.

## What triggers a check

The Web server checks at startup and on its 30-second cycle. A request waits
until the assigned run has ended and there is no pending delivery, native queue
or manual pause. Uncertain state also waits. The host checks again just before
sending, so a newly queued message can prevent the automatic request.

The monitor allows **two total requests per meaningful change**, including the
first. User feedback and substantive Goal or Brief changes create a new allowance
after any unresolved request is accounted for. Ordinary agent comments,
heartbeats, identical saves and internal no-work results do not.

After two checks, monitoring rests until another relevant change. A reported
result alone does not prove the run ended; the monitor waits for execution
evidence before sending again. The allowance and unresolved requests survive
server restarts.

## What the agent receives

The request describes what remains and points to a short Goal index. Unfinished
Goals lead to an unfinished-work query; completed Goals with unanswered questions
lead to Letters. When all Goals are Done and no Letter is open, it asks for a
concrete omission and otherwise leaves the project at rest. Older CLI versions
use their supported compact tree command.

The agent should advance agreed work, ask necessary questions as Letters, and
continue independent work while waiting. The second request makes the cost of
overlooking a step explicit. Neither request expands the agreement or overrides
a user's stop.

## See what happened

On CLI versions with the activity view, open **Agent → AutoContinue → History**.
The count describes pending or running checks, not the whole history. Finished
checks remain in history; Off does not erase them. View message shows the saved
request, rather than a reconstruction from a newer template.

“No work reported” is the agent's report, not proof of project completion.
Actual work and decisions belong in the usual Brief, Comment or Letter. A
no-work result returns through the monitor's internal command without posting
another Web message that could disturb a resting project.

For command details, run `chill monitor --help` with the stable command from
setup. Implementation: [monitor policy](../../lib/continuation-monitor.mjs) and
[activity projection](../../lib/continuation-extension.mjs). The host's delivery
contract lives in the [CLI guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/extensions/requests.md).
