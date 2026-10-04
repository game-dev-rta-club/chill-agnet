---
name: chill-agent-message-setup
description: Set up optional user notifications and phone access to chill-agent Web pages, choosing available messaging tools and a Cloudflare publishing method with the user. Use to configure, change, or disable these connections.
---

# Chill Agent Message Setup

## What this adds

Chill-agent helps the user agree on a goal, leave work to an agent, and review
plans and results on a shared Web page. This Skill makes that useful away from
the computer: they can forget about the task, hear when their attention matters,
and respond from their phone.

There are two independent choices:

- **Notifications:** bring the user back when results are ready or their input
  would help, without making them check repeatedly.
- **Phone access:** let the user read the Goal and give feedback wherever they
  are, using an external URL.

Either can be used alone. Both are optional for local use. Once configured,
everyday work starts with `chill-agent`; the setup should remain useful across
new chats rather than become another chore.

## Help the user choose what fits

Start with what they already have. Look at saved preferences and the tools,
plugins, and relevant Skills available in the current agent app. Reuse choices
they have already authorized and explain the missing pieces in plain language.

The user may never have chosen a notification method before. Take responsibility
for finding a workable option and explain the experience they would get:
which app shows the alert, who can see it, and what tapping it will open.
Recommend the easiest suitable route supported by what you found. For example,
with Slack connected: "We can let you know in Slack when the work is finished
or needs your input. The reminder is just for you. Shall we try that?" Offer a
different app or skipping notifications as understandable alternatives, without
requiring the user to choose a technical mechanism.

If their preference is still unclear, ask a familiar question such as which
apps they open on their phone, rather than asking for a notification workflow.
If they are unsure, explain the benefit and setup effort of a small set of
concrete options and recommend one. Suggest completion and needed-input alerts
as a starting point; let them adjust it instead of filling out a questionnaire.
A useful notification is a short invitation to return, with a Goal link when
phone access is available.

For other services, investigate the user's chosen app and available tools case
by case. For Discord, explain "a short update in a channel you choose" and
check who may read that channel before guiding the Webhook setup. Explain any
setup needed and distinguish an untested option from a working route.

For phone access, explain that Cloudflare makes the PC's page reachable from a
phone, then help the user compare what the two choices mean for them:

- **A temporary link to try it:** little setup, no account or domain needed.
  There is no sign-in check. Anyone with the link can read all exposed Goals
  and submit feedback. Recommend it only for material they agree to expose.
- **A link that checks who signs in:** only the people they allow may enter.
  This needs a Cloudflare account, a domain, and more setup, which you guide.
  Cloudflare handles the sign-in; chill-agent needs no separate login system.

The best setup is one they understand, can use, and can stop. Agree on the
publishing method and message destination before configuring them; reuse that
agreement throughout the work. Local-only use is a useful outcome too.

## Set it up together

Turn the chosen approach into something the user can actually try. Check what
is already installed, offer missing setup, and involve the user where an
account login or personal choice is needed. The [Cloudflare guide](references/cloudflare.md)
covers external service setup; CLI help covers chill-agent's own operations.

Handle technical checks and authorized setup yourself. Make the finish line
visible before asking the user to act: present the chosen setup's full path as
one concise guide, including anything they need ready, the actions they will
take, what you will handle, and the final check that shows it works. Name the
buttons or fields they will see and group actions they can complete in one pass
so they can proceed at their own pace without reporting after every step.
Introduce terms such as Webhook, Tunnel, or Access with plain-language explanations
where needed. If they get stuck, focus help on that point while keeping the
remaining steps visible.

Test a notification through the chosen tool to the agreed destination, and ask
whether the user actually received the alert on their intended device. A saved
reminder or successful post alone is not proof that a notification arrived. For
phone access, check that the page opens and a reply returns to its Goal. A
connector becoming ready alone does not establish that the experience works.
Save successful settings for later chats, report anything still unverified,
and explain how to disable either capability without changing the other.

## Tools and operational limits

Resolve this plugin's root two directories above the installed Skill directory.
Start with the helper's help, then read the relevant command's help for JSON
formats, commands, and examples:

```sh
node '<plugin-root>/bin/chill-link.mjs' --help
```

The helper finds the prepared core without relying on its plugin cache path.
Use the same data directory as core. If core is missing, install and run
`chill-agent` first. Read shared settings before changing them; new chats should
reuse the saved method, recipient, and occasions. The agent sends through the
available host tool after saving a Comment or Letter selected for notification; server/Hook reminders do not send
messages themselves. `settings notice --help` explains the fresh lookup.

### Slack Reminder delivery

For Slack, use a personal **Reminder**. A normal message posted as the user's
own account may not alert them, even in a self-DM.

Use the connected Slack reminder-creation tool for the authenticated user in
the agreed workspace, with the literal `time: "1 minute ago"`. Do not replace it
with a calculated past timestamp: that returned `cannot_parse` in our test.
Despite the wording, the tested connector returned a scheduled time about one
minute later; the user confirmed receiving the notification after enabling
notifications. Do not promise immediate delivery. Check the returned time and
tell the user when to expect the test alert.

If the reminder exists but no alert appears, check the user's notification
settings and intended device before sending another test. Reuse the agreed
method in later chats by saving the actual reminder tool and non-secret
workspace/recipient identifiers through the settings command.

### Other services

Use the selected service's current documentation to guide setup. For example,
[Discord Webhooks](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)
can post to an agreed server channel; verify that the user receives the desired
alert rather than assuming a channel post causes one. This route has not yet
been tested here. Keep a Webhook URL/token in the sending integration's secret
storage, not in a Goal, committed file, or chill-agent's non-secret settings.
Only call a setup reusable when a later chat can find the configured sending
tool and destination; explain any missing integration instead of saving a
placeholder as if it worked.

A listed plugin may not have a callable sending tool. Verify availability, keep
credentials with the service, and explain missing connections rather than
silently choosing another service. Test only the agreed recipient and occasions;
uncertain sends need checking before retrying to avoid duplicate messages.

Publishing exposes all Goals in the selected data directory, not just the open
one. An account or tunnel alone is not access control: configure and verify
Cloudflare Access before calling it protected. Do not fall back to a public
Quick URL without the user's choice. A localhost link cannot open the desktop's
page on a phone. Notifications alone can still deliver a plain completion message.

Runtime support is currently Codex Desktop on macOS. Claude packaging is a
structure preview; its Web callbacks are not connected yet.
