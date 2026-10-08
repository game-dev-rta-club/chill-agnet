---
keyPoints: >-
  Install one complete built chill-agent skill folder for either host, then invoke
  it in the target project. The agent prepares the local workspace; native Hook
  approval and Claude connection activation can still require user action.
---

# Install and invoke the skill

Install the complete **`dist/skills/chill-agent`** folder from a built package,
including `scripts/start.mjs` and `scripts/runtime.json`. The skill does not
contain the application or node_modules. Its manifest selects an exact official
application commit; the starter installs it with npm on first invocation.
Do not copy SKILL.md alone.

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

The agent runs the starter on first use, creates or reuses an isolated
project data store, selects an available local port and starts Web. Existing
connected conversations continue using their established workspace. Invoking
the skill does not silently move their Goals to a different project.

## First connection

First acquisition requires Node.js 24.15+, npm, Git and network access. The
automatic Web startup currently requires macOS and the
supported host. Native tool access
and Hook approval remain under your host's control. Codex can ask you to trust
the project Hook. Claude needs a verified SessionStart handoff and may require
exiting and resuming the **same conversation** after Hook review. The agent will
say when this is necessary; copying files alone cannot establish that connection.
See [Claude reception](claude-code.md) for its finite idle-watch limitation.

## Stable release

Download **chill-agent-skill-0.4.0.tgz** from [release v0.4.0](https://github.com/game-dev-rta-club/chill-agnet/releases/tag/v0.4.0).
Extract it and install the complete `chill-agent/` folder using the locations
above. This is a thin skill: its manifest pins the release's exact application
commit. On first invocation, npm acquires and builds that commit with the fixed
CLI input. Later invocations reuse the project-specific installation.

The separate `game-dev-rta-club-chill-agent-0.4.0.tgz` asset is the npm-installable
application archive, with its composed runtime, the same thin skill and bundled
compatibility plugins. This is a GitHub archive distribution, not an npm registry
package.

For a fixed development checkout, maintainers can run `npm ci` and
`npm run check:development` with Node.js 24 to build `dist/skills/chill-agent`.
A source-only copy without a generated runtime.json is incomplete. Existing plugin artifacts remain
available for compatibility. See [build layout](../development/build-and-plugins.md).

Official host references: [Codex skills](https://learn.chatgpt.com/docs/build-skills)
and [Claude Code skills](https://code.claude.com/docs/en/skills).

## Development installs and updates

Both 0.4.0 release and development builds emit a thin skill. The starter uses npm to install the
full app at the immutable Git commit in runtime.json, including its pinned CLI
and locked dependencies. No npm registry release or version bump is required
for this development path. First installation builds the package and may take
a few minutes. Later runs reuse the installed copy without a network request.

Installations live under `~/.chill-agent/installations/<project-hash>/<pin-hash>/`,
outside the project Git tree. The project identity is its resolved absolute
folder; pass `--project` for preparation and run guide commands from that folder.
Data, settings and existing runtime snapshots stay in their existing locations.
Updating the skill does not restart Web, migrate data, or silently update an
existing conversation. Keep node_modules and installations out of Git.

See [runtime acquisition](../development/runtime-acquisition.md) for the design.
