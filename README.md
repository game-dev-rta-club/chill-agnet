---
keyPoints: >-
  Agree on an outcome and return to one workspace for plans, feedback and decisions.
  Start with the complete Codex plugin; AutoContinue and notifications are optional.
---

<p align="center"><img src="assets/overview.svg" alt="chill-agent: agree on a goal, let the agent work, review the result" width="100%" /></p>

<p align="center"><a href="https://github.com/game-dev-rta-club/chill-agnet/actions"><img alt="CI" src="https://github.com/game-dev-rta-club/chill-agnet/actions/workflows/ci.yml/badge.svg" /></a> <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-green" /> <img alt="Node.js 24" src="https://img.shields.io/badge/node-24-339933" /></p>

# Work you can leave with an agent

Describe what you want to achieve, agree on a direction, and let your agent get to work. chill-agent keeps the plan, progress, and questions in one place—so you can come back without catching up on a long chat.

| Agree on the goal | Leave useful feedback | Stay in control |
| --- | --- | --- |
| See the plan and progress | Comment right on the work | Pause, resume, or change direction |

<p align="center"><img src="assets/workspace.png" alt="A Goal page showing its Brief, Conversation, and agent controls" width="900" /></p>

## A place to come back to

- **Goals** describe the outcome. Larger jobs can be split into smaller Goals.
- **Briefs** show the current plan or result, ready to read and comment on.
- **Letters** bring you questions that need your decision.

Your agent uses the same workspace. You can shape the work as it goes, without having to repeat the whole conversation.

Want help keeping things moving? Turn on [AutoContinue](docs/using/auto-continue.md). After the agent's run ends, chill-agent asks it to pick up any agreed work it can continue. You stay in control of what it takes on.

## Get started

You will need **Codex Desktop on macOS, Node.js 24, and Git**. Setup currently uses the terminal:

```sh
git clone https://github.com/game-dev-rta-club/chill-agnet.git
cd chill-agnet
npm ci
npm run build
node bin/chill.mjs setup prepare --project /path/to/your/project
```

Replace `/path/to/your/project` with the folder you want to work in. Setup prints a stable command; use it to start the Web workspace:

```sh
<command> server start --configured
```

Load the built `dist/codex/chill-agent` plugin in Codex, then ask:

> Use chill-agent to help me plan and build my project.

The package includes the workspace tools you need. There is no separate CLI to install. [Notifications](docs/using/notifications.md) and phone access are optional; the adjacent `chill-agent-message-setup` plugin helps you set them up. Switch notifications for each project in the Agent menu.

Next, see [how to work together](docs/using/working-together.md), or find a focused guide in [the documentation](docs/README.md).

## Building your own workflow?

Use [chill-agent-cli](https://github.com/game-dev-rta-club/chill-agent-cli) if you want the workspace and agent connection with your own scheduling or orchestration. Its repository owns the CLI reference and extension documentation.

## Help make it better

Ideas, small fixes, and clearer wording are welcome. Start with [Contributing](CONTRIBUTING.md). Maintainers can find the release process in [Releasing](RELEASING.md).

[Security](SECURITY.md) · [MIT license](LICENSE)

This is experimental software. Keep backups of important workspaces.
