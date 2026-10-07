---
keyPoints: >-
  Follow the shared branch and milestone-commit workflow, test the composed archive,
  and keep dependent changes in Draft until the required CLI release is pinned.
---

# Develop the complete experience

Use the shared [branch, commit and review workflow](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/development/workflow.md).
In a sibling checkout its source is `chill-agent-cli/docs/development/workflow.md`.
The important handoff is a tested, committed change with any remaining work
explicitly recorded. Commit each useful milestone before moving to another
concern; keep a focused, short-lived branch for each change.

This repository owns skills, extensions and product guidance. Core data, Web
hosting and harness contracts belong to the CLI. Use
[two-repository development](two-repositories.md) to test the actual CLI archive
rather than a source symlink. Keep the CLI commit and archive hash in the PR's
verification notes so someone else can reproduce the integration.

## A change that needs a new CLI capability

1. Implement and verify the CLI change on its own branch.
2. Pack it and install the archive here with `--no-save --package-lock=false`.
3. Run the composed `npm run check` and isolated integration scenarios.
4. Keep the app PR in Draft until a reviewed CLI release is available.
5. Adopt that exact release URL and lockfile, then verify a clean `npm ci` and
   `npm run check` before marking the PR Ready.

Local archive success is useful development evidence. It does not mean the
committed public dependency can build that branch. Record that difference;
do not publish a tag while relying on an unrecorded local package replacement.
The CLI release and app release are separate steps in [Releasing](../../RELEASING.md).

## Before handing work back

Inspect `git status --short` and commit completed source, tests and documentation
in their owning repository. Report both branches/commits for a cross-repository
change. Describe any intentionally unfinished files and which CLI revision was
tested. Run the [build and plugin checks](build-and-plugins.md); generated
`dist/` and installed personal runtime snapshots are not source commits.
