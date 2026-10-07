---
keyPoints: >-
  The Skill owns experience and decision guidance; action references hold conditional
  detail. Feedback points to the packaged entry; AutoContinue directly selects its combined
  continuation and stopping-review guide. Both use current Goal data.
---

# Maintain the skill and its handoffs

Edit the [central Skill](../../plugins/chill-agent/skills/chill-agent/SKILL.md)
for the desired experience and the small set of principles that guide decisions.
The purpose is an outcome the user can enjoy without managing each step. Explain
why a judgment matters so the agent can apply it to a new situation; a growing
list of case-specific prohibitions is easy to miss and hard to maintain.

## One action, one guide

Organize `references/<subject>/<action>.md` around the action the agent is taking,
not each safeguard or CLI command. The selected guide should be enough to judge
and carry out that action, using current Goal facts, the verified runtime
interface and installed command help. It should not require a chain of other
references before the agent can decide. A new action can select its own guide.

For example, sending a message includes choosing Letter or Comment and handling
its notification; it does not need separate reporting, delivery-review and
notification readings. AutoContinue includes both continuing useful work and
checking whether the outcome was delivered. Feedback includes interpreting a
Letter reply and resuming the affected work. Separate Goal creation, regrouping
and completion remain useful because each has a different result to produce.

Lead each page with that result and its purpose. Keep consequential boundaries
such as scope, explicit pauses and missing authorization visible, with a compact
example where it teaches the judgment. When a failure appears, first improve
the purpose or distinction in the existing action guide. Add a file only for a
separately selectable action, not to append one more check.

A small repeated principle is preferable to a mandatory reading hop, but detailed
command syntax belongs in installed help and host differences in the runtime
interface. A guide may point to a genuinely different next action; it must not
hide prerequisites for its own decision behind that link. Review the whole
entry table and callers when moving guidance, and remove superseded files.
`node scripts/check-skill.mjs` validates reachability and links; the build copies
the complete skill into the runtime and both host plugins. These checks do not
establish that the purpose is understood.

[Connection guidance](../../plugins/chill-agent/skills/chill-agent/references/workspace/connect.md)
asks the runtime for the selected interface; shared guides contain no host-specific
receipt or activation rules. See [harness boundaries](harness-boundaries.md) and
[Claude entry](claude-plugin.md) for their separate development topics.

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
