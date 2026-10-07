---
keyPoints: >-
  On first skill invocation the agent prepares an isolated project and starts Web
  with the bundled starter. Reuse established connections; native hook approval
  and Claude SessionStart are separate from installing files.
---

# Connect this conversation

Keep the calling harness and its conversation/context. A project directory or
Goal ID is not authority to hand work to a different conversation.

## Reuse an established connection

When working from incoming chill feedback or an already verified connection,
reuse its exact stable CLI prefix, data directory and port. Read its current
context; do not run first-use setup against the current shell directory, migrate
its Goals or replace its runtime just because a newer skill is installed.
For an explicit new-project request, use that project's directory instead.

## First use after installing the skill

The user installs the complete skill folder and invokes chill-agent. Do the
preparation yourself; do not give them a list of setup commands to execute.
Identify the calling harness and its actual project directory, not the skill
installation folder. If either is unavailable, ask only for that missing fact.
For Claude, read [the native connection guide](claude-code.md) first, including
how to identify its native project/settings directory.

Resolve `scripts/start.mjs` relative to this installed skill's directory and run
it with the available Node.js 24 executable:

```sh
node '<skill-directory>/scripts/start.mjs' --project '<project-directory>' --harness codex-desktop
```

Use `--harness claude-code` inside Claude Code. This bundled helper prepares a
project-isolated runtime, hooks and data store and starts its local Web. It
reuses the project's store and chooses its port automatically. It does not
create a Root, turn on Auto mode, publish a URL, or grant native permissions.
No separate CLI installation or user-run setup script is required. A missing
runtime means an incomplete installation; request the complete built skill,
not an arbitrary download or another harness.

Keep the returned stable `command` prefix for later CLI actions. Setup output
and a running Web are not proof that feedback can reach this conversation.
Codex may require native `/hooks` review/trust; explain just that necessary
step. For Claude, verify the main-tool identity handoff as the native guide
requires; when SessionStart is missing, explain exit and resume of this same
conversation. Never clear, fork, fabricate identity or approve trust on behalf
of the user. Report what is ready and what still needs native activation.

After connection verification, follow [Create a Goal](../goals/create.md) and
[Use the CLI](use-cli.md). Open the returned local Web URL once a useful Goal
exists. Preserve established public links, ports, settings and other queues.
