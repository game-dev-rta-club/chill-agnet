---
keyPoints: >-
  Develop pins the SQLite-capable CLI and qualifies an isolated native Web roundtrip.
  New development workspaces use SQLite by default; installed runtimes and production data are unchanged.
  Explicit resume reception is tested separately from unattended idle operation.
---

# Qualify the SQLite runtime

The development input pins CLI `ff982e8a0f38a42c6e7cfe9287b15c507f94a662`.
Prepare that exact composed artifact using `npm ci` and
`npm run check:development`. The stable release dependency is unchanged.
See [cross-repository inputs](two-repositories.md) for the build contract and
[SQLite storage](https://github.com/game-dev-rta-club/chill-agent-cli/blob/develop/docs/runtime/sqlite.md)
for data ownership, query boundaries and migration stages.

New data directories select SQLite without a storage variable, and existing
database directories detect it on reopening. Node.js 24.15 or newer is required.
Existing schema-marked JSON workspaces stay JSON until explicitly migrated;
the stable release dependency and installed runtimes are unchanged.
Never point a rehearsal at the original legacy data directory.

## Run the native Web roundtrip

```sh
node scripts/probe-native-interface.mjs --run --sqlite-web \
  --skill dist/skills/chill-agent
```

Use `--auth-settings /path/to/native-settings.json` only to explicitly import
native environment authentication into process memory. The probe does not copy
that settings file or print credentials. It installs the built standalone skill
and hooks in a temporary project, then:

1. Invokes the skill in a fresh Claude print-mode conversation and saves one Root
   and Comment through the selected native interface.
2. Starts the composed Web server against the same isolated SQLite directory and
   posts a feedback message through HTTP.
3. Resumes the same native session, which receives that feedback and saves the
   requested Comment and completed activity receipt.
4. Reads the response through Web, stops the server, and reopens the stored records.

Each native phase has a $0.80 budget and a 180-second time limit. The explicit
resume is a test stimulus; this does not establish unattended idle reception,
interactive first-use approval UX, production cutover or old-data migration.
The fixture, its sessions and temporary settings are removed afterward.

On 2026-10-07, Claude Code 2.1.292 passed all 17 checks with the earlier CLI
`8240ec7b887c460bfa6f489617222a9d16773a88` using explicit SQLite selection.
Both phases used the same native session, had no permission denials, and cost
$0.2047 combined. Web received the expected reply and the feedback completed;
a fresh reader retained the reply after server shutdown. Auto mode remained Off.

The current default-SQLite build passed all 17 checks on 2026-10-07 with
Claude Code 2.1.292, the same session across both phases, no permission denials,
and $0.22454 combined cost. An earlier attempt completed the storage roundtrip
but failed the conservative route check; its summary did not distinguish help
from mutation attempts. The probe now identifies only simple prepared-launcher
help calls separately, with regression tests; compound commands remain checked.
The successful rerun contained no `goal create`, `goal assign` or `goal work`
calls, so its route result does not depend on that help exemption.

## Keep the contract under test

The composed `test/sqlite-runtime.test.mjs` uses a real HTTP server and native
hook protocol events without calling a model. It checks one feedback offer,
working/completed receipts, Web output and persistence, including the absence of
a parallel JSON schema. `npm run check:development` runs this with the fixed CLI.
The native probe above separately establishes actual model/tool integration.

The existing 11 Claude continuation tests also pass with SQLite:

```sh
node --test dist/runtime/test/claude-continuation.test.mjs
```

Storage-qualified delivery is not migration evidence. Before switching an old
installation, inventory its transport/extension files, import a copy preserving
IDs and receipts, prevent replay during validation, and test recovery. No running
user workspace is updated by these build or qualification commands.

## Rehearse migration with the composed artifact

The runtime includes `bin/chill-migrate.mjs` and its SQLite implementation.
Use its `create`, `verify`, `restore`, `verify-restored`, `prepare` and
`verify-prepared` commands against disposable copies. Follow the CLI
[migration guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/develop/docs/runtime/sqlite-migration.md).
`prepare` creates a pending data directory; its marker blocks normal startup
until activation reconciles historical bindings and unresolved transport state.
It does not reconnect old sessions or activate archived queues.
