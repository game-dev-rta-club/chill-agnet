---
keyPoints: >-
  Claude runs on your computer while Web delivers feedback to the same conversation.
  Keep one receiver open, check the finite watch, and recover Saved messages without
  resending them. This experimental connection does not start Claude from Web.
---

# Use Web with Claude Code

Claude Code does the work on your computer. The Web page sends your feedback to
that conversation and shows its saved replies. Keep the computer awake and the
receiving Claude conversation running when you leave the terminal for your phone.
Opening Web alone does not start Claude.

This is an experimental development connection. Follow the
[Claude plugin setup](../development/claude-plugin.md) to prepare the project,
review its native hooks and connect a new Goal. Loading a plugin alone does not
complete setup or grant tool permissions. Your installed version's setup help
is the source for supported options.

## Before leaving the computer

1. Check that the intended conversation is connected to the intended Goal.
2. Send one message from its Web page and wait for a reply from that same
   conversation. A push notification alone does not verify this round trip.
3. If you want reception between responses, explicitly configure the finite idle
   watch during setup. Check its duration; it expires without automatic renewal.
4. Resolve any required native tool approvals in Claude. Turn on
   [AutoContinue](auto-continue.md) only if you want autonomous continuation too.
   It neither grants tool permissions nor keeps a closed Claude process alive.

Keep a single receiving process for the conversation. If it is already running,
opening the same conversation in another CLI can interfere with reception.
Automatic transfer between a background receiver and another CLI is not supported.

## Return to the same conversation

After the receiver has ended, return to the original project folder and use
`claude --resume` to select the same conversation. Retain the project's prepared
hooks and plugin setup. Current development builds start the configured idle
watch on normal resume without requiring an extra first message; older builds
may not include that fix. Check your installed version before relying on it.

Do not create a different conversation or Goal to recover the old one's input.
A new conversation does not inherit the original context or connection.

## When a message stays Saved

Saved means the message is stored but has not yet been received by the agent.
Do not repeatedly send it or delete it to make the queue look clear.

Check the original receiver: is Claude still running, is its finite watch still
active, and is a native permission prompt waiting? Also check that you opened the
connected conversation, rather than a new one. Resume or recover the inbox in
that same conversation using the connection guide. A stopped receiver and an
expired watch need recovery; refreshing Web does not start reception.

Keep the saved message until its receipt and reply are confirmed. If the cause
is unclear, retain its event ID and report the startup method and connection
state. The agent's [native connection guide](../../extensions/harnesses/claude-code.mjs)
covers inbox recovery and confirmed receipts.
