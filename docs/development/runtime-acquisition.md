---
keyPoints: >-
  Standalone skills pin an official app commit and install through npm into a
  project-specific directory. Dependency files stay out of the consumer Git tree;
  active workspace updates remain a separate explicit operation.
---

# Keep the skill small and the runtime fixed

A standalone skill contains instructions, a starter and runtime.json. It does
not carry the Web application or node_modules. npm owns package acquisition and
Git dependency preparation; we do not build a second download/package manager.
The app still composes the CLI and extensions. This changes distribution, not
the boundary between repositories or the SQLite data model.

## Pin and prepare

The development manifest accepts only the official app Git URL with a full
40-character commit. Moving branches and latest are rejected. npm prepares the
Git dependency from that revision, using the committed package lock and exact
`development-cli.json` input, then builds the composed runtime. This requires
Node.js 24.15+, npm, Git and network on first installation. No version is bumped
and no registry publication is implicit. A future registry distribution must
provide an equally immutable input and locked transitive dependencies.

Install under `~/.chill-agent/installations/<resolved-project-hash>/<pin-hash>`.
Even identical versions are installed separately for different projects. Write
into a temporary sibling and publish only after the runtime exists; a failed
installation is removed. Concurrent installers can converge on the same completed
copy. Preserve old pins. Subsequent use reads the installed copy without asking
for a newer package. npm's download cache is not the durable runtime location.

## Update deliberately

Commit the small skill and its generated pin in consumer projects. Exclude
installed packages from Git. Installing a different skill pin acquires a new
copy; it does not rewrite another project's installation. Data and settings are
not stored in the package. Existing conversations keep their established stable
launcher and immutable snapshot until an explicit runtime update. Never delete
SQLite data while reinstalling a skill, or treat a program downgrade as a data
migration rollback.

Compatibility plugin archives remain bundled. Windows automatic Web startup is
still unsupported; changing npm acquisition does not remove that limitation.

Verification covers offline reuse, project and pin isolation, failed acquisition
and concurrent publication. Integration also needs a real clean npm Git install
of a pushed commit. Local build success alone does not prove remote acquisition.
