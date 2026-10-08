---
keyPoints: >-
  Install one complete built chill-agent skill folder for either host, then invoke
  it in the target project. The agent checks tools, prepares an initial Goal and
  opens Web. Missing tools and native activation receive specific instructions.
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

The first invocation follows this sequence:

1. **Check this computer.** The agent checks Node.js 24.15+, npm and Git before
   downloading the fixed application. It also checks `cloudflared`, which is
   needed for a phone or public link. If a tool is missing or unusable, it explains
   what it does and asks before installing or repairing it. You can choose local
   use without cloudflared. Installing it does not turn on public access.
2. **Prepare your first Goal.** If you supplied an outcome, its title and Brief
   start with that request. If you just invoked the skill, the page starts with
   “Let's decide what you want to achieve” and a short explanation. You answer
   the first question there, then the agent updates that same Goal as the
   direction becomes clear. It does not leave a separate setup Goal behind.
3. **Open the page.** The agent opens Web with its browser tool and provides a
   clickable link. It says what you can do next in plain language. If opening is
   unavailable, it provides the link without claiming to have opened it.

The first download needs network access. Automatic Web startup currently requires
macOS and a supported host. Native tool access and Hook approval remain under
your host's control. If activation prevents Goal creation, the agent opens the
workspace page first, explains what is still needed and gives one concrete
action. A running Web is not proof that replies are connected.

Codex may ask you to review the chill-agent connection. The agent identifies the
actual review control offered by your installed host instead of assuming the
CLI's `/hooks` command is available in Desktop. See the official
[Hook review documentation](https://learn.chatgpt.com/docs/hooks#review-and-trust-hooks).
Claude needs a verified SessionStart handoff and may require exiting and resuming
the **same conversation** after Hook review. The agent explains this only when
needed; copying files alone cannot establish that connection.
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

When a pull or skill installation changes the selected application commit,
the **local Web** on the supported macOS setup shows an update icon in its top
menu. Click it to see “再起動すると新しいバージョンになります。” Choose **OK**
to prepare the new version and restart at the same page, or **キャンセル** to
keep using the current version. If preparation fails, the current Web stays
running. Detection does not download anything or change another project.

This feature needs an update-capable runtime and one invocation of its installed
standalone skill to remember the skill's location. Older running versions need
the existing explicit runtime update once before they can show this icon.
Public links, foreground servers and Windows do not offer this restart button.
The icon follows the installed skill's fixed commit; it does not search GitHub
for releases. A program rollback does not undo a database migration.

See [runtime acquisition](../development/runtime-acquisition.md) for the design.
