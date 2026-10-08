---
keyPoints: >-
  Tagged distribution history, including the composed experience and the tested
  CLI dependency. Unreleased checkout changes are not features of an older release.
---

# Changelog

## 0.4.0

- Minor release in the pre-1.0 line, adopting CLI 0.4.0. Compatibility and migration history are recorded in the [0.4.0 release notes](https://github.com/game-dev-rta-club/chill-agnet/releases/tag/v0.4.0).
- Create SQLite workspaces by default, with paged conversation history, indexed reads and reusable coordination leases. Node.js 24.15+ is required; no separate database service is needed.
- Distribute a thin standalone skill for Codex and experimental Claude. It pins this release's exact application commit and acquires its fixed CLI and locked dependencies through npm into a project-specific installation on first use. Existing active workspaces are not silently restarted or migrated.
- Use Letters only for necessary replies, choices and permissions. Save results in Comments, continue authorized work while nonblocking questions are unanswered, and review the next useful action before stopping Auto mode.
- Stabilize Goal/Letter scrolling and background Activity/Brief updates. Archive obsolete root Goals without losing history.
- Keep experimental Claude reception and native Hook requirements explicit. Windows portable checks are not Windows automatic Web startup or Desktop integration support.

## 0.3.0

- Minor feature release in the 0.x line, adopting CLI 0.3.0. Existing workspace data and plugin paths remain supported; existing shared stores are not automatically migrated.
- Ship one complete standalone skill for normal Codex/Claude installation and invocation, with bundled runtime preparation and isolated project Web setup.
- Separate shared skill decisions from harness-specific runtime guidance and native connection enforcement.
- Add Web notification/public-link controls, QR links, project color themes and current Activity controls. Notifications are Letter-only; each device registers independently.
- Improve autonomous continuation guidance and make one follow-up include both continuation and stopping review.
- Retain experimental Claude limits: native Hook activation and a running same-session Claude are required; finite reception is not a background service or an overnight guarantee. Automatic Web startup is qualified on macOS with Node.js 24.
- Publish a standalone skill archive alongside the npm-installable application archive, and verify release metadata before publishing.

## 0.2.0

- Add optional Root-level Notifications with retained connections, setup requests and exact-message history.
- Reserve each saved notification once and record host-tool acceptance separately from device delivery.
- Preserve previous shared preferences for existing Roots; new Roots start Off with no backlog replay.
- Adopt CLI 0.2.0 with compact Goal review, Agent presence, activity history and shared extension controls.
- Ship outcome-led agent guidance, focused documentation and improved continuation messages.

## 0.1.0

- First standalone chill-agent distribution.
- Preserve existing Goal data and stable runtime commands.
- Versioned extension contract and independently tested package archives.
