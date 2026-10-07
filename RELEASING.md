---
keyPoints: >-
  Release the composed package from a reviewed version tag and a clean archive test.
  Adopt CLI releases explicitly with an exact URL, lockfile integrity and integration checks.
---

# Release the complete package

Use [the shared change-based version policy](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/RELEASING.md#choose-a-version-from-the-change) for this package's public behavior and supported integrations. In a sibling checkout, read that canonical policy before selecting a version. Fixes increment PATCH, compatible features MINOR, and incompatible stable contracts MAJOR; digits have no rollover limit. During 0.x, features and breaking changes increment MINOR with explicit compatibility notes. The
CLI has its [own release process](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/RELEASING.md).
A new CLI release does not update this package automatically.

The app and CLI are versioned independently. A CLI bump alone does not dictate
an app bump; assess the complete supported experience. Our public surface includes
skill entry points, installation/update paths, Web behavior, saved Goal access and
supported extensions. Experimental Claude restrictions remain explicit. A 1.0
release means a deliberate compatibility commitment, not that 0.9.9 was reached.

Choose an explicit version, then use `npm version <version> --no-git-tag-version`.
`npm run release:check` verifies manifest/lockfile alignment and a Changelog entry;
the release workflow additionally verifies the tag and main ancestry. Record the
bump rationale, compatibility impact, CLI version and limitations in the Changelog.
Never overwrite a release/tag; corrections get a new version. Develop integrations
retain their commit identity without consuming a release number every time.

Integrate release preparation into develop, promote develop to main with a checked
PR. Prefer a merge commit when permitted; when protected main requires squash,
keep that rule and immediately merge main back into develop, checking identical
trees and restored ancestry. An explicit user request to publish authorizes that release; the general
consultation rule does not require asking again for the same action.

## Adopt a CLI release

When the complete experience needs a CLI change, select a published, reviewed
CLI archive. Update its exact release URL in `package.json` and regenerate the
lockfile with npm so the archive has an integrity hash. Use a dependency-update
PR and run the composed package's checks before merging. Do not ship a floating
branch or a personal local path.

For changes spanning both repositories, use the
[local archive workflow](docs/development/two-repositories.md) before publishing
the CLI release. Keep dependency adoption separate from documentation-only edits.

## Publish an archive

Consult the user before changing versions, promoting to main or publishing.
Autonomous develop work does not authorize changes distributed to users.

1. Open a release PR updating `package.json`, the lockfile and `CHANGELOG.md`.
2. Run `npm ci`, `npm run check` and `npm pack`. Install the archive into a clean
   temporary project and verify setup, the Web workspace and the continuation
   integration with an isolated data directory. Never use production Goal data
   for a release smoke test.
3. Merge after required CI. Create `v<version>` on the reviewed commit, matching
   the package version. Release tags are protected from updates and deletion.
4. The [release workflow](.github/workflows/release.yml) reruns the checks and
   attaches the npm-installable archive and complete standalone skill archive to a GitHub Release. The build generates
   plugin manifests from the package version; do not hand-edit generated bundles.

Archives are distributed through GitHub Releases. npm registry publication is
not configured and no registry credentials are required. Do not document an npm
registry install until a package has actually been published there.

## Update a running installation

Follow the CLI's [runtime update guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/runtime/data-and-updates.md).
After upgrading the composed runtime, verify Goals, held feedback and the
monitor setting and history. Update the loaded skill plugin separately when its
instructions change; [building alone does not install it](docs/development/build-and-plugins.md).

Agent entry: [read before release](.agents/skills/chill-app-release/SKILL.md).
