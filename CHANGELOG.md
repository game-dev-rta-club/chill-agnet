---
keyPoints: >-
  Tagged distribution history, including the composed experience and the tested
  CLI dependency. Unreleased checkout changes are not features of an older release.
---

# Changelog

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
