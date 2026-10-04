# Two repositories, one server

The all-in-one package depends on one exact CLI release archive. `npm run build`
assembles an immutable runtime from the CLI package's public runtime export and
adds the monitor module and command manifest. The runtime runs one Web server.

The CLI owns data, Web, native delivery, execution locks, queue/pause facts and
request idempotency. The monitor owns the 30-second/two-attempt policy, wording,
configuration and result journal. Policy imports only the versioned extension API.

Existing data remains in the same directory. The continuation journal keeps its
path and attempt IDs. Legacy per-Root launchd jobs are retired when the extension
starts. No monitor is enabled by installation or migration.

Source history before extraction is retained locally; public repositories start
with reviewed distribution source, without local research notes or personal data.
