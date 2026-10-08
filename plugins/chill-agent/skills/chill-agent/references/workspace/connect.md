---
keyPoints: >-
  Reuse the calling workspace. On first use follow the runtime's welcome flow:
  prepare an initial Goal, open Web and request only necessary native activation.
---

# Connect this conversation

Keep the calling harness and conversation/context. A project directory or Goal
ID does not authorize handing work to another conversation.

## Read the selected interface

On first use, check prerequisites before acquiring the application or preparing
the workspace:

```sh
node '<skill-directory>/scripts/start.mjs' preflight
```

This check installs nothing. If Node cannot run, inspect the local installation
first. Node.js 24.15+, npm and Git are needed; `cloudflared` is needed for a phone
or public link. Explain any missing tool's purpose and the specific installation
you propose, and obtain the user's agreement before installing or repairing it.
For missing cloudflared, offer installation or local-only use. Reuse permission
already given for that exact action, then recheck. Tool installation does not
authorize publishing a link. Do not replace this with a setup command list for
the user. Existing connected work does not need repeated installation questions.

Identify the calling harness from the current host, never from a model name or
another Goal's binding. Do not guess when the host is unknown. Resolve this
script relative to the installed skill and run:

```sh
node '<skill-directory>/scripts/start.mjs' guide --harness '<calling-harness-id>'
```

This does not change Goals or connect a conversation. On first invocation the
starter may install its fixed runtime with npm; run from the native project
directory so the installation remains project-local. A runtime that supports it also exposes the same result as
`session guide --harness <calling-harness-id>`. Keep using the installed reader
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
Follow `interface.onboarding` in order, using the returned `url` and `command`.
The selected interface's `activation` and operation confirmation rules determine
what must be verified before Root creation. Preparation alone does not verify
native activation; `connectionVerified:false` is not evidence that approval is
required. Native trust remains the user's decision.

Do not give the user a setup command list. An incomplete installation needs the
complete built skill, not a different harness or an arbitrary runtime download.
Prepare the initial Goal and Brief from the supplied outcome, or the interface's
discovery starter when the user only asks to begin. Open that page using the host
browser tool before asking a question or ending the turn. If native activation
prevents creation, open the workspace URL first and explain the required action
using the interface's short message. If opening fails, supply the clickable URL.
Keep the same Goal as the conversation gives it a concrete outcome. An existing
connection keeps its Goal; resuming must not add another starter.
Preserve existing public-access settings, queues and manual pauses.
