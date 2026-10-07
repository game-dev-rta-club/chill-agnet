---
keyPoints: >-
  Read later corrections before acting. Codex can defer independent input in its
  native Queue; Claude uses main-hook receipts without a deferred Queue state.
---

# Receive feedback during work

Keep the user's new intent and the work already entrusted to you recoverable.
Read the original messages in order, including later corrections, before choosing
what to do. The Goal on which a comment arrived is context, not a reason to switch
tasks. A change to the current request, a correction or a stop takes effect now.

On Claude Code, follow the [native receipt route](../workspace/claude-code.md).
It has no deferred Queue receipt. The Queue operations below apply to Codex Desktop.

For an independent request that is better handled after the current work, use
`goal activity --event <ID> --state deferred`. This records that you read it and
checks that its native Queue entry is still pending. Leave it there and continue
the original task. The saved Conversation contains the full request; intake alone
needs no new Goal, Brief or checklist. A successful deferment suppresses repeated
Hook notices in the same turn without claiming or completing the request.

At a useful checkpoint, take up the pending request yourself, or let the native
Queue start it after the current run ends. Use `working` when starting: it claims
that event and removes only its matching queue entry. Then select the Goal you
will advance. Ordinary outcome-based Goal splitting still applies when needed.

If deferment fails because the queue entry has started, disappeared or could not
be verified, do not promise a later delivery or re-enqueue it blindly. Check its
current state and handle already-started input. Preserve manual pauses. Skip
already completed events, and record `completed` or `failed` only for work you
actually handled. These receipts do not mark a Goal Done.
