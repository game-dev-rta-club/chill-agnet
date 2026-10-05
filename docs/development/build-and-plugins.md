---
keyPoints: >-
  npm run build combines the installed CLI with the monitor and emits two Codex
  plugins. Edit sources under plugins/; dist/ is generated and is not a source tree.
---

# Build the runtime and plugins

Run `npm ci` and `npm run build` from this repository with Node.js 24. The build
uses the installed CLI package's public `./runtime` export, then adds this
repository's monitor and extension manifest. It does not fetch a newer CLI by
itself.

| Source | Generated output | Purpose |
| --- | --- | --- |
| Installed CLI + `lib/` + monitor entry | `dist/runtime/` | Web, CLI and optional continuation in one runtime |
| `plugins/chill-agent/` + composed runtime | `dist/codex/chill-agent/` | Core skill with its runtime |
| `plugins/chill-agent-message-setup/` + link helper | `dist/codex/chill-agent-message-setup/` | Optional setup skill that finds the prepared core |

`bin/chill.mjs` dispatches development commands into `dist/runtime/`. Build before
using it. `npm run check` builds with test files and runs this repository's tests
inside the composed runtime; normal build omits that test copy. `npm pack` runs
the build first and packages the allowlisted output.

## Edit the original skill

The core instructions live in
[plugins/chill-agent/skills/chill-agent/SKILL.md](../../plugins/chill-agent/skills/chill-agent/SKILL.md).
The optional setup instructions live in
[plugins/chill-agent-message-setup/skills/chill-agent-message-setup/SKILL.md](../../plugins/chill-agent-message-setup/skills/chill-agent-message-setup/SKILL.md).
References under each skill travel with it. These are agent instructions;
the user and developer guides in `docs/` explain the product and implementation.

Edit those source files, then rebuild. Do not edit `dist/` or an installed plugin
cache as the source of a change. The build copies the package version into plugin
manifests. Loading a generated plugin into Codex is a separate installation step;
building alone does not change the plugin currently in use.

Current build output targets Codex. The build script does not generate a Claude
plugin; older design records are not evidence of a supported integration.

## Prepare and update an installation

Use `node bin/chill.mjs setup --help` to prepare a project from a built checkout.
The core plugin contains the runtime; the optional message-setup plugin uses
`chill-link.mjs` to find the already prepared core in the same data directory.

The CLI owns the stable launcher, hook and runtime snapshots. Follow its
[data and runtime update guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/runtime/data-and-updates.md)
for installation mechanics and server restarts. Building or loading a new skill
does not replace an already running Web server.

Implementation: [build script](../../scripts/build.mjs),
[development entry](../../bin/chill.mjs), [package manifest](../../package.json).
