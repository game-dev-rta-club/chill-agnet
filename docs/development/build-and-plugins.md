---
keyPoints: >-
  npm run build combines the installed CLI with application extensions and emits Codex and experimental Claude
  plugins. Edit sources under plugins/; dist/ is generated and is not a source tree.
---

# Build the runtime and plugins

Run `npm ci` and `npm run build` from this repository with Node.js 24. The build
uses the installed CLI package's public `./runtime` export, then adds this
repository's continuation, notification and public-link extensions. It does not fetch a newer CLI by
itself.

| Source | Generated output | Purpose |
| --- | --- | --- |
| Shared skill + composed runtime | `dist/skills/chill-agent/` | Standalone skill; runtime nested under `scripts/runtime/` |
| Installed CLI + `lib/` + `extensions/` + monitor entry | `dist/runtime/` | Web, CLI and optional extensions in one runtime |
| `plugins/chill-agent/` + composed runtime | `dist/codex/chill-agent/` | Codex skill with its runtime |
| Shared skill + native manifest + composed runtime | `dist/claude/chill-agent/` | Experimental Claude plugin; hooks need explicit setup |

`bin/chill.mjs` dispatches development commands into `dist/runtime/`. Build before
using it. `npm run check` builds with test files and runs this repository's tests
inside the composed runtime; normal build omits that test copy. Both plugin
outputs always omit tests. `scripts/check-plugins.mjs` verifies identical skill
files across outputs and separation of host metadata. `npm pack` runs
the build first and packages the allowlisted output.

## Edit the original skill

The core instructions live in
[plugins/chill-agent/skills/chill-agent/SKILL.md](../../plugins/chill-agent/skills/chill-agent/SKILL.md).
Its action guides live under `references/<subject>/<action>.md` and travel with
it. The build checks that local links resolve and every guide is reachable from
the entry. It also copies the same skill to the runtime's `skills/chill-agent/`
and sets `agentGuide` in `extensions.json`, so handoffs use instructions from
that immutable snapshot. See [skill and handoffs](skill-and-handoffs.md). These are agent instructions;
the user and developer guides in `docs/` explain the product and implementation.

For substantial guidance changes, use the
[decision evaluation workflow](evaluating-the-skill.md) to check how a fresh agent
uses the skill.

Edit those source files, then rebuild. Do not edit `dist/` or an installed plugin
cache as the source of a change. The build copies the package version into plugin
manifests. Loading a generated plugin into Codex is a separate installation step;
building alone does not change the plugin currently in use.

The build also emits an experimental [Claude plugin](claude-plugin.md), sharing
the same skill source. Its manifest contains no automatic hook installation or
permission grants. Both host artifacts are included in the package archive.
The composed runtime also registers an experimental native connection provider
through the CLI's `connection-hooks` capability. Building does not install its
native hooks. See [Claude Auto mode qualification](claude-auto-mode.md).

## Prepare and update an installation

Use `node bin/chill.mjs setup --help` to prepare a project from a built checkout.
Codex is the default. For experimental native Claude project hooks, select
`setup prepare --harness claude-code --project /absolute/project`; use the
[CLI setup guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/agent/claude-setup.md)
for activation, finite idle watch and removal. A settings write is not evidence
that a conversation is connected. Building alone installs no native hooks.

The core plugin contains the runtime. Notifications and phone access are
configured through the Web
[Notifications](../using/notifications.md) and [Public link](../using/public-link.md) panels.

The CLI owns the stable launcher, hook and runtime snapshots. Follow its
[data and runtime update guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/runtime/data-and-updates.md)
for installation mechanics and server restarts. Building or loading a new skill
does not replace an already running Web server.

Implementation: [build script](../../scripts/build.mjs),
[development entry](../../bin/chill.mjs), [package manifest](../../package.json).

The standalone skill is the preferred user entry. Its bundled starter selects
an isolated project and starts Web when invoked by the agent; native Hook
activation is still required. See [installation](../using/install.md). Runtime
copying is one-way, so the embedded runtime does not recursively contain the
standalone artifact. Existing plugin and immutable-runtime skill layouts use
the same starter with the runtime at their package root.
