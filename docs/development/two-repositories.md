---
keyPoints: >-
  Develop the main package and CLI as sibling checkouts. Test a CLI archive without
  saving a local-path dependency; releases keep an exact reviewed CLI archive pin.
---

# Change the right repository

Keep two independent checkouts in one development folder if that makes navigation
easier. The parent does not need a Git repository or a package workspace.

```text
development/
  chill-agent/
    chill-agent/       skills, composition and continuation policy
    chill-agent-cli/   data, Web, harness and extension host
```

The public main repository URL is spelled `chill-agnet`; you can name its local
checkout `chill-agent`. Run Git commands inside the repository you are changing.
See [architecture](../architecture.md) for the responsibility boundary.

## Start with the pinned dependency

`npm ci` in the main checkout installs its exact CLI release archive.
`npm run check` verifies the composed package. Use this combination for a change
that only affects skills or monitor policy. A new CLI commit does not silently
change the dependency used by an existing main release.

## Try a CLI change locally

Build and test in the CLI checkout, then run `npm pack --pack-destination <directory>`.
Use the archive path reported by npm in the main checkout:

```sh
npm install --ignore-scripts --no-save --package-lock=false /absolute/path/to/cli-archive.tgz
npm run check
```

This tests the real package boundary, including its allowlisted runtime files.
Keep `package.json` and `package-lock.json` unchanged during a temporary local
test. Rerun pack/install after another CLI edit; the archive is a snapshot, not
a live link. `npm ci` restores the pinned release, and `npm run build` then
rebuilds the normal runtime.

A local workspace helper may automate those steps, but it is not required by
either public repository. Do not publish a dependency on a personal file path.

## Adopt and document the change

Merge and release the CLI change first when the main package needs a new host
capability. Then update the exact archive URL and lockfile in a main-package PR,
test the combination and follow [Releasing](../../RELEASING.md). Documentation
alone does not change that pin.

CLI behavior belongs in the
[CLI guides](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/README.md).
Keep this README and user guides about the complete experience. A CLI-only
implementation change should not require rewriting the main README unless the
experience or setup actually changes. When changing instructions later, read the
[skill sources and build layout](build-and-plugins.md) first.
