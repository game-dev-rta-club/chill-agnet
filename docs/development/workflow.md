---
keyPoints: >-
  The entrusted agent merges checked topic PRs into develop and keeps main stable.
  Integrate CLI changes first, then verify the app against an exact reproducible
  CLI artifact; local package overrides alone never make an app PR mergeable.
---

# Integrate the complete experience

Use the shared [development workflow](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/development/workflow.md).
In sibling checkouts, read `chill-agent-cli/docs/development/workflow.md`.
The agreed model is topic → PR → `develop`, with the entrusted agent responsible
for review, checks, merge and branch cleanup. Routine merges into `develop` do
not wait for the user. `main` is the stable line. Version bumps, promotion and publication affecting
users require consultation with the user before execution; develop integration
authority does not include them.

This repository owns skills, extensions and product guidance. Core data, Web
hosting and harness contracts belong to the CLI. Commit each verified milestone;
integrate a complete slice before opening another dependent topic. Use
[two-repository development](two-repositories.md) for archive-based local tests.

## Integrate a new CLI capability

1. Merge and verify the CLI PR in its `develop` branch first.
2. Make the exact CLI revision reproducible in the app. Prefer an immutable
   development package when development artifact publication is configured and
   authorized. Alternatively add a versioned development input (full CLI commit
   SHA) and a shared script used by both local checks and CI to fetch that revision,
   run `npm ci`, build, pack and install its archive before composed checks.
3. Adopt that input in the app PR, including the lockfile when it is a package
   dependency. CI must use the same input; a moving `develop` URL is not a pin.
4. Verify a fresh checkout through the documented development command, composed
   tests and relevant integration scenarios. Merge into app `develop` and verify
   post-merge CI, then clean up the topic branch.
5. Before promotion to `main`, pin the exact stable CLI release archive and lockfile
   and verify ordinary `npm ci` plus `npm run check`, with no development override.

The fixed development input is now recorded in `development-cli.json` and built
by `npm run cli:development`; `npm run check:development` prepares it and checks
the app. See [the archive workflow](two-repositories.md) for exact commands.
Remote preparation requires that commit to be available in the official CLI
repository. Adoption into develop CI is still pending; current CI continues to
check the stable package dependency. Until that gate is connected and green, a
CLI-dependent app PR remains Draft. Do not publish a release merely to bypass it.

This separates frequent development integration from public release cadence.
A local `--no-save` archive test remains useful evidence, but does not by itself
satisfy the integration gate. Do not commit a personal filesystem path.

## Record integration, not only implementation

Report both repository commits, the tested CLI input, PR merge results and any
remaining blocker. Keep [build and plugin checks](build-and-plugins.md) as the
verification entry point. Generated `dist/` and installed runtime snapshots are
not source commits. A merge does not restart a user's Web server or Claude session.

For initial adoption, preserve the current accumulated topic as a bootstrap PR
into `develop` created from remote `main`. Establish the CLI dependency path before
calling the app integrated. Audit old branches against actual PRs and active
worktrees before deleting anything. Follow [Releasing](../../RELEASING.md) for
stable promotion and distribution; integration authority is not release authority.

Agent entry: [read before development](../../.agents/skills/chill-app-development/SKILL.md).
When changing this workflow, use [guideline authoring](guidelines.md).
