---
keyPoints: >-
  Ask the runtime for the calling connection's interface. Reuse a verified
  workspace; on first use let the runtime prepare it and follow its next actions.
---

# Connect this conversation

Keep the calling harness and conversation/context. A project directory or Goal
ID does not authorize handing work to another conversation.

## Read the selected interface

Identify the calling harness from the current host, never from a model name or
another Goal's binding. Do not guess when the host is unknown. Resolve this
script relative to the installed skill and run:

```sh
node '<skill-directory>/scripts/start.mjs' guide --harness '<calling-harness-id>'
```

This is read-only. A runtime that supports it also exposes the same result as
`session guide --harness <calling-harness-id>`. Keep using the bundled reader
when an established workspace has an older runtime; do not upgrade it just to
read guidance. Follow its `operations`, confirmation rules, `nextActions`
and constraints; reuse that interface while the connection is unchanged. It
owns host-specific commands, native activation and unsupported operations.
No operation, or a null operation, is permission to use another host's route.

## Prepare only when needed

Incoming feedback or an already verified connection supplies the stable prefix,
data directory and port to reuse. Do not replace that workspace or its runtime
merely because a newer skill is installed. An explicit new-project request uses
that project's directory instead.

On first use, identify the native project directory using the selected interface.
Do not use the skill installation folder. Run the preparation yourself:

```sh
node '<skill-directory>/scripts/start.mjs' start --project '<native-project-directory>' --harness '<calling-harness-id>'
```

Use the available Node.js 24 executable. The runtime prepares the isolated store
and starts or reuses Web, returning its stable `command` and selected interface.
Follow the returned next actions and verify connection confirmation before Root
creation. Native trust or activation may require the user; never approve it on
their behalf. An installed file or a running Web is not proof of connection.

Do not give the user a setup command list. An incomplete installation needs the
complete built skill, not a different harness or an arbitrary runtime download.
After connection verification, creating a useful Goal is the next action; open
the local Web once it exists.
Preserve existing public-access settings, queues and manual pauses.
