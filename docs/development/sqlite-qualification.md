---
keyPoints: >-
  Develop pins the SQLite-capable CLI and qualifies an isolated native Web roundtrip.
  SQLite remains opt-in; ordinary installations and production data are unchanged.
  Explicit resume reception is tested separately from unattended idle operation.
---

# Qualify the SQLite runtime

The development input pins CLI `8240ec7b887c460bfa6f489617222a9d16773a88`.
Prepare that exact composed artifact using `npm ci` and
`npm run check:development`. The stable release dependency is unchanged.
See [cross-repository inputs](two-repositories.md) for the build contract and
[SQLite storage](https://github.com/game-dev-rta-club/chill-agent-cli/blob/develop/docs/runtime/sqlite.md)
for data ownership, query boundaries and migration stages.

For a disposable data directory, `CHILL_AGENT_STORAGE=sqlite` selects SQLite;
existing database directories detect it on reopening. This is still an opt-in
development path, not a production migration or a default-install change.
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

On 2026-10-07, Claude Code 2.1.292 passed all 17 checks with the pinned CLI.
Both phases used the same native session, had no permission denials, and cost
$0.2047 combined. Web received the expected reply and the feedback completed;
a fresh reader retained the reply after server shutdown. Auto mode remained Off.

## Keep the contract under test

The composed `test/sqlite-runtime.test.mjs` uses a real HTTP server and native
hook protocol events without calling a model. It checks one feedback offer,
working/completed receipts, Web output and persistence, including the absence of
a parallel JSON schema. `npm run check:development` runs this with the fixed CLI.
The native probe above separately establishes actual model/tool integration.

The existing 11 Claude continuation tests also pass with SQLite:

```sh
CHILL_AGENT_STORAGE=sqlite node --test dist/runtime/test/claude-continuation.test.mjs
```

Storage-qualified delivery is not migration evidence. Before switching an old
installation, inventory its transport/extension files, import a copy preserving
IDs and receipts, prevent replay during validation, and test recovery. No running
user workspace is updated by these build or qualification commands.
