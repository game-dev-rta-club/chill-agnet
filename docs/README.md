---
keyPoints: >-
  Choose a user guide for everyday work or a development guide for composition
  and releases. CLI commands and host contracts live in the CLI repository.
---

# Find what you need

Start with [the README](../README.md) to install chill-agent. Then choose the
part you want to understand:

| You want to… | Read |
| --- | --- |
| Agree on work, leave feedback and review the result | [Work together](using/working-together.md) |
| Let the agent check for work it can continue | [AutoContinue](using/auto-continue.md) |
| Hear when results or decisions need your attention | [Notifications](using/notifications.md) |
| Open the workspace on your phone or keep a fixed URL | [Public link](using/public-link.md) |
| Understand why there are two repositories | [Architecture](architecture.md) |
| Change a skill or inspect a built plugin | [Build and plugin layout](development/build-and-plugins.md) |
| Change action guides or agent handoffs | [Skill and handoffs](development/skill-and-handoffs.md) |
| Try the shared skill in Claude Code | [Experimental Claude plugin](development/claude-plugin.md) |
| Qualify continuation in a native Claude conversation | [Experimental Claude Auto mode](development/claude-auto-mode.md) |
| Check whether skill guidance leads to useful decisions | [Evaluate the skill](development/evaluating-the-skill.md) |
| Test a change across both repositories | [Develop across repositories](development/two-repositories.md) |
| Choose branches, commit milestones and prepare a PR | [Development workflow](development/workflow.md) |
| Publish an update | [Releasing](../RELEASING.md) |

For command formats, Goal storage, runtime updates or the extension API, use the
[CLI documentation](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/docs/README.md).
Its installed `--help` describes the commands your version supports.

These pages describe current source. The package pins a tested CLI release, so
newer CLI screens can appear in a development checkout before a packaged update
adopts them. [AutoContinue](using/auto-continue.md) identifies the relevant UI
differences; changing documentation does not upgrade a running installation.

Public guides are tracked in Git. Older local investigations may be retained in
an existing checkout, but are not published specifications or shipped features.
