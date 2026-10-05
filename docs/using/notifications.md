---
keyPoints: >-
  Switch notifications per Root from the Agent menu without losing the connection.
  History shows the saved message and tool receipt; phone access stays independent.
---

# Hear when your attention matters

Open the Agent menu and find **Notifications**. Choose **Set up** to ask the
assigned agent to help you choose an available app, recipient and occasions.
That request appears in Conversation. The setup skill checks the connection
with you; clicking Set up does not send a test message by itself.

After setup, the bell and **On / Off** control notifications for the current
Root and all its child Goals. Off keeps your connection. Turn it back on when
you want alerts again. **Change** asks the agent to review the destination.
New Roots start Off and can reuse a saved connection when you enable them.

The agent chooses meaningful result Comments and questions saved as Letters
for notification, according to your settings. Routine progress, Brief saves
and AutoContinue checks with no work do not need another interruption. Sending
uses the agent's available connected tool, so it depends on that tool and the
agent's run; the Web server does not send by itself.

## See what happened

**History** opens the most recent notifications for this Root and its current
assigned agent. Expand **View message** to read the exact prepared text and
destination. **Sent** means the sending tool accepted it, not that your phone
displayed it. **Failed** records a failed attempt; **Unconfirmed** means no
confirmed tool result is available. Uncertain attempts are not retried
automatically. Check the connection before asking for another message.

Turning Off stops new preparations. A message already handed to the agent or
external tool can still arrive. Turning On does not replay older posts or
posts made while Off. Reading History does not trigger a notification.

## Keep phone access separate

Notifications work without publishing the Web workspace. With a confirmed
phone link, the message links to its Goal or Letter; otherwise it contains
plain text. A localhost address is not presented as a phone link.

Changing notification settings does not open or close phone access. The
optional message-setup skill helps with either choice. Credentials stay in
the connected tool; chill-agent stores only non-secret connection identifiers.

When upgrading from shared notification settings, existing Roots retain the
previous On/Off choice and known connection. Old posts are not replayed. If
the old connection was removed, use Set up again rather than guessing it.
