---
keyPoints: >-
  Release and development builds qualify an isolated SQLite Web roundtrip.
  New workspaces use SQLite by default; qualification leaves production data unchanged.
  Explicit resume reception is tested separately from unattended idle operation.
---

# Qualify the SQLite runtime

The 0.4.0 release adopts CLI 0.4.0. Use `npm ci` and `npm run check` for the
released dependency; `npm run check:development` selects the exact commit in
`development-cli.json`. See [cross-repository inputs](two-repositories.md) for
the build contract and [SQLite storage](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/runtime/sqlite.md)
for data ownership and query boundaries.

New data directories select SQLite without a storage variable, and database
directories detect it on reopening. Node.js 24.15 or newer is required. Run these
qualification commands only with their isolated test data.

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

The earlier default-SQLite build (CLI `ff982e8a0f38a42c6e7cfe9287b15c507f94a662`) passed all 17 checks on 2026-10-07 with
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
The current composed test also verifies that coordination leases are released
and no numbered lock JSON files accumulate during the Web/native roundtrip.
The fixed CLI uses a separate `coordination.sqlite` for short ownership leases;
no database transaction spans native or network work.

The existing 11 Claude continuation tests also pass with SQLite:

```sh
node --test dist/runtime/test/claude-continuation.test.mjs
```

The runtime also includes `bin/chill-migrate.mjs`. Its offline tool contract is
documented in the CLI [migration guide](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/runtime/sqlite-migration.md).
