---
keyPoints: >-
  Pair product-repository development guides with task-triggered read-this skills.
  Keep contributor skills separate from distributed end-user plugins; the CLI
  repository owns the shared guideline-authoring method.
---

# Connect product guidance to its task

Maintain a development guide and its read-this entry together. In this repository,
`docs/development/` owns product build, cross-repository integration and skill
maintenance guidance. `.agents/skills/chill-app-*/SKILL.md` contains the short
contributor entry points; `plugins/chill-agent/skills/` is the separate end-user
product. Do not bundle contributor rules into the product plugin.

When adding or changing a guideline, identify the task that needs it. Give the
skill a description naming that action and a short body linking the canonical
page. Keep detailed rules in the page, not copied into the skill. Repair AGENTS,
the documentation index and inbound links in the same commit. Keep relative links
portable and describe planned behavior separately from working features.

The shared authoring method is owned by the CLI repository at
`docs/development/guidelines.md`; when both repositories are checked out, read it
there for changes to the shared method. Do not create a second copy of that method
here. Product-specific guidance and its entries remain usable in this checkout
without a sibling installation.

Validate each skill's frontmatter and relative links, then check that requests to
fix a bug, merge a PR, release a version and change a development guideline select
the intended pages. A valid skill file is not proof of native auto-selection:
check a fresh repository task's skill inventory; existing tasks can use the
explicit AGENTS links until their inventory refreshes.

The entry for maintaining this page is
[write guidelines](../../.agents/skills/chill-app-write-guidelines/SKILL.md).
Other entries are [development](../../.agents/skills/chill-app-development/SKILL.md)
and [release](../../.agents/skills/chill-app-release/SKILL.md).
