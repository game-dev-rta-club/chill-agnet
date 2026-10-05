---
keyPoints: >-
  Use fresh saved notification preferences and the agreed host tool. A successful
  send confirms tool acceptance, not delivery to the user's device.
---

# Notify through the configured route

Read `settings notice --help` and retrieve current preferences before sending.
Use only the agreed route, recipient and occasions. Keep the message short and
link to the relevant Web result or Letter. Do not turn routine progress into
repeated interruptions. Local work can continue with notifications disabled.

For a configured Slack Reminder route, use the reminder-creation tool with
literal `time: "1 minute ago"` for the agreed workspace and authenticated
recipient. The tested connector scheduled it about one minute later; do not
promise immediate delivery or substitute a normal self-DM. Other routes follow
the method agreed during message setup. Successful API acceptance does not prove
that the user's device displayed the notification.

If the user wants to configure or change messaging or phone access, use the
separate `chill-agent-message-setup` skill. Do not silently configure a route
as part of ordinary Goal work.
