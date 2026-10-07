---
keyPoints: >-
  Install one complete built chill-agent skill folder for either host, then invoke
  it in the target project. The agent prepares the local workspace; native Hook
  approval and Claude connection activation can still require user action.
---

# Install and invoke the skill

Install the complete **`dist/skills/chill-agent`** folder from a built package,
including its `scripts/runtime/` directory. Do not install only `SKILL.md` or the
source folder under `plugins/`: those do not contain the execution runtime.

| Host | Personal skill location | Project-local alternative |
| --- | --- | --- |
| Codex | `~/.agents/skills/chill-agent/` | `.agents/skills/chill-agent/` |
| Claude Code | `~/.claude/skills/chill-agent/` | `.claude/skills/chill-agent/` |

Use the host's normal skill installer or copy that complete folder to its skill
location. Avoid enabling an older chill-agent plugin and the standalone skill
at the same time. Restart/reload skill discovery if your host requires it.
In the target project, select **chill-agent** from the skill picker (Codex also
supports `$chill-agent`), or type `/chill-agent` in Claude Code. Describe the
outcome you want. No user-run `chill-agent-setup.mjs` command is needed.

The agent runs the bundled starter on first use, creates or reuses an isolated
project data store, selects an available local port and starts Web. Existing
connected conversations continue using their established workspace. Invoking
the skill does not silently move their Goals to a different project.

## First connection

The automatic Web startup currently requires macOS, Node.js 24 and the
supported host. Native tool access
and Hook approval remain under your host's control. Codex can ask you to trust
the project Hook. Claude needs a verified SessionStart handoff and may require
exiting and resuming the **same conversation** after Hook review. The agent will
say when this is necessary; copying files alone cannot establish that connection.
See [Claude reception](claude-code.md) for its finite idle-watch limitation.

## Obtain the release

Download **chill-agent-skill-0.3.0.tgz** from [release v0.3.0](https://github.com/game-dev-rta-club/chill-agnet/releases/tag/v0.3.0).
Extract it and install the complete `chill-agent/` folder using the locations
above. It contains the bundled runtime; no build or setup script is required
from the user. The separate `game-dev-rta-club-chill-agent-0.3.0.tgz` asset is the
npm-installable application archive, including the same standalone skill and
compatibility plugin outputs. This is a GitHub archive distribution, not an npm
registry package.

For a fixed development checkout, maintainers can run `npm ci` and
`npm run check:development` with Node.js 24 to build `dist/skills/chill-agent`.
A GitHub skill installer pointed at the source `plugins/` folder is **not**
equivalent: it does not include the runtime. Existing plugin artifacts remain
available for compatibility. See [build layout](../development/build-and-plugins.md).

Official host references: [Codex skills](https://learn.chatgpt.com/docs/build-skills)
and [Claude Code skills](https://code.claude.com/docs/en/skills).
