---
keyPoints: >-
  Test decisions with a fresh agent, one realistic question at a time, without
  showing the grading criteria. Preserve exact skill snapshots and answers;
  revise the cause of a mistake and check it again on new scenarios.
---

# Check whether the skill helps an agent decide

The [core skill](../../plugins/chill-agent/skills/chill-agent/SKILL.md) should help
an agent advance an agreed outcome while keeping the user's burden low. A valid
Markdown file cannot establish that behavior. Use a small decision exercise
alongside the package checks when changing its guidance substantially.

## Set up an independent reading

Save the candidate skill and its references as an immutable snapshot. Record
their hashes, the evaluator model and reasoning setting. Start the evaluator
without the author's conversation, conclusions or grading criteria. Give it
the skill path and only the facts needed for one realistic situation.

Keep questions and expected decisions in a separate author-side record, written
before collecting answers. Cover both initiative and restraint: shaping an
unclear goal, making delegated choices, asking an asynchronous question,
respecting authorization, interpreting feedback, verifying completion and
responding to AutoContinue.

Ask what the agent would do next and where it would leave its response. Give one
question per turn. Do not coach it between questions. Keep scenarios synthetic:
reading the skill and saving an answer is enough; no production messages,
purchases, state changes or scheduled runs are needed.

## Judge decisions, then improve the explanation

Retain the exact question and answer. Judge the proposed behavior, not whether
it repeats a preferred phrase. A pass needs an actionable next step within the
agreement and an appropriate communication route. Record partial answers and
uncertainty explicitly. Unauthorized actions, abandoned delegated work and
incorrect completion are failures even if the prose sounds convincing.

For a miss, identify which concept or emphasis led to it. Prefer clarifying the
relationship between ideas, moving the important guidance or removing an
overly strong instruction. Avoid adding one rule for every test question.

Snapshot the revision and use a fresh evaluator for retests and previously
unseen variations. Check nearby behavior too: a correction that stops premature
action must still allow work the user has already delegated.

## Report what the exercise establishes

Keep prompts, raw answers, judgments and revision reasons in the work record;
share the useful conclusions in the Goal's Brief. Distinguish repeated questions
from unseen scenarios. Report the number of trials and any unresolved mistakes.
A small Q&A exercise checks proposed decisions, not real tool execution or a
statistical success rate. Without a comparison condition, it also cannot measure
how much improvement the skill caused.

Finally validate metadata and reference links, rebuild and compare the shipped
skill with the source, and run the repository checks. Follow
[build and plugin layout](build-and-plugins.md) for the separate installation
step; a successful build does not replace the skill already loaded in a chat.
