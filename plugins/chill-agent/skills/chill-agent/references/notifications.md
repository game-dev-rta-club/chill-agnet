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

With the Notifications extension, the Web switch applies to the current Root.
After saving a Letter or a Comment worth notifying, `settings notice` reserves
that saved event and returns the exact message, tool, destination and result
command. If enabled, send that message once through the returned tool, then
record `sent`, `failed` or `unconfirmed` using the returned command. A disabled
response means skip it, including events already prepared or older than the
current settings. Do not reconstruct or resend an uncertain notification.

History keeps the original message and receipt internally; recording its result
does not need another Conversation post. `sent` means the tool accepted the
request, not that the device displayed it. A null mobile URL calls for a plain
message, not a localhost link. Use `settings show --id <GOAL>` for the Root's
preferences and the installed help for the supported command forms.

For a configured Slack Reminder route, use the reminder-creation tool with
literal `time: "1 minute ago"` for the agreed workspace and authenticated
recipient. The tested connector scheduled it about one minute later; do not
promise immediate delivery or substitute a normal self-DM. Other routes follow
the method agreed during message setup. Successful API acceptance does not prove
that the user's device displayed the notification.

If the user wants to configure or change messaging or phone access, use the
separate `chill-agent-message-setup` skill. Do not silently configure a route
as part of ordinary Goal work.
