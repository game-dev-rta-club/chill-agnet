---
keyPoints: >-
  The Skill owns experience and decision guidance; action references hold conditional
  detail. Feedback points to the packaged entry; AutoContinue directly selects its combined
  continuation and stopping-review guide. Both use current Goal data.
---

# Maintain the skill and its handoffs

Edit the [central Skill](../../plugins/chill-agent/skills/chill-agent/SKILL.md)
for the desired experience, decision principles and routing. Put conditional
guidance under `references/<subject>/<action>.md`: for example, creating a Goal
and deciding whether to ask a Letter are different decisions. Each guide should
explain when it helps, what judgment is needed and what useful result remains.
The directory is not a mandatory workflow or a list of every CLI command.

Use installed CLI help for arguments. Keep an explanation in one guide and link
to it where needed. When moving a guide, update its entry and inbound links;
`node scripts/check-skill.mjs` validates reachability and local links. The build
runs this check and copies the whole skill into the runtime and both host plugins.
[Connection guidance](../../plugins/chill-agent/skills/chill-agent/references/workspace/connect.md)
asks the runtime for the selected connection interface; shared guides contain
no host-specific receipt or activation rules. See [harness boundaries](harness-boundaries.md). See the [Claude entry](claude-plugin.md) for its experimental limits.

## Direct handoffs, current facts

```text
Web feedback → CLI delivery → current context + packaged Skill entry
AutoContinue → observed facts + filtered index + auto-mode/continue.md
Agent → selected action guide → work → Brief / Comment / Letter
```

The runtime manifest names the entry. The CLI resolves its path within the
immutable snapshot; it does not know chill-agent's reference names. The application's
AutoContinue extension selects its own `references/auto-mode/continue.md` beside
that entry. This one guide combines choosing useful work and checking a decision
to stop, so the monitor sends one request per meaningful revision. Its server
keepalive uses the same allowance. A plain CLI
without a guide keeps a minimal generic handoff. AutoContinue's scheduling,
reservation and pause handling remain independent of guidance text.

`goal show --section context` uses the existing Goal reader. It retains scope,
criteria, new input and question references while linking to Brief and Letter
bodies. No second summary store or inferred completion state is involved.

## Verify the format, then evaluate behavior

Package checks verify links, preserved feedback, working read commands and
unchanged delivery invariants. They do not establish the quality of agent
judgment. After the format is ready, use the separate
[evaluation workflow](evaluating-the-skill.md) for Q&A and isolated tool exercises.
Record which snapshot was tested; a source edit alone does not update a running
server or the installed plugin. See [build and installation](build-and-plugins.md).
