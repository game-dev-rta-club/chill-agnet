---
keyPoints: >-
  The build emits an experimental Claude plugin with the shared skill and composed
  runtime. Loading the plugin does not install hooks, enable Auto mode or change
  native permissions. Prepare the project explicitly and retain the same chat.
---

# Try the skill in Claude Code

Build this repository, then load `dist/claude/chill-agent` with Claude Code's
native development plugin option. This is a development artifact, not a published
marketplace release:

```sh
claude --plugin-dir /absolute/path/to/chill-agent/dist/claude/chill-agent
```

In that conversation, invoke `/chill-agent:chill-agent` or ask to use chill-agent.
The plugin contains the same skill and references as the Codex plugin, plus its
composed runtime. Its [native manifest](../../plugins/claude-code/.claude-plugin/plugin.json)
contains no hooks, tool permission grants, MCP server or background process.
The [official plugin layout](https://code.claude.com/docs/en/plugins-reference#standard-layout)
keeps the manifest in `.claude-plugin/` and the skill at the plugin root's `skills/`.

Loading the skill does not establish a return path. The shared entry routes Claude
to [its connection guide](../../plugins/chill-agent/skills/chill-agent/references/workspace/claude-code.md).
It explicitly prepares native project hooks, preserves the user's permissions and
other hooks, and distinguishes settings being saved from native activation. A
SessionStart handoff is needed; if it has not occurred, use the native exit-and-resume
flow for that same chat after reviewing the hooks. Do not replace a running chat
with a second process or transfer another Root's context.

## Use the operations supported by this connection

Claude creates a new Root through `connection create-goal`. Each connection action
is a separate main Bash call whose result is confirmed by the native hook. Child
Goals, Briefs and Conversation use the shared workspace commands. Feedback uses
`connection activity`, not Codex's Queue/deferred receipt. `goal work` and live
execution controls remain unavailable on this native route.

Auto mode is a separate opt-in extension. The optional idle watch is finite; its
expiry does not renew it. Neither plugin loading nor project setup enables Auto
mode or promises overnight reception. See [native Auto mode](claude-auto-mode.md)
and the [CLI setup contract](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/agent/claude-setup.md)
for the current limits.

## Check the packaged entry

`npm run check` verifies that all skill files are identical across source, runtime
and both plugins, that their links resolve, and that host metadata stays separate.
It also runs the application regression tests. Validate the built native manifest
with `claude plugin validate --strict dist/claude/chill-agent`.

The opt-in `scripts/probe-claude-plugin.mjs` in the CLI checkout loads this actual
plugin in a disposable native print-mode conversation. It prepares hooks in a
temporary project, asks the skill to record an agreed outcome, and checks the saved
Root/Comment and the references read. A successful metadata check alone is not
evidence that the agent used the native guide or created a correctly bound Root.
Use `--help` for budgets, isolation and explicit authentication options. This is
an entry/routing exercise, not a measurement of general agent decision quality.

On **2026-10-06, Claude Code 2.1.289**, the native exercise passed all 11 checks.
The packaged skill was discovered and invoked, and successful Bash read results
contained the complete connect, native Claude and Goal-creation guides from the
artifact. One Root was bound to that session and one Comment was saved. Codex
work/assignment operations were not called; Auto mode and server startup stayed
off. The test imports only explicitly selected authentication into memory and
uses prepared temporary hooks with narrowly allowed test commands.

The CLI's `scripts/probe-claude-onboarding.mjs` separately exercises first-use
interactive screens, explicit setup between exit and resume, the packaged Skill
and native default permission prompts. That flow also retained the earlier
context and completed Web feedback receipts on 2026-10-06. Individual Read/Bash
operations were approved in the disposable environment. The
[setup guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/agent/claude-setup.md)
explains why native tool permissions are separate from chill Auto mode. Setup
inside an already running chat and unattended long-term reception remain open.
