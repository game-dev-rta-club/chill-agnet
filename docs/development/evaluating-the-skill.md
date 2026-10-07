---
keyPoints: >-
  Test decisions with a fresh agent, one realistic question at a time, without
  showing the grading criteria. Preserve exact skill snapshots and answers;
  revise the cause of a mistake and check it again on new scenarios.
---

# Check whether the skill helps an agent decide

Check that the selected action guide supplies its own decision context; record
any extra reference reading the evaluator needs for the same action. A shorter
file that requires a chain of readings is not a simpler interface.

The [core skill](../../plugins/chill-agent/skills/chill-agent/SKILL.md) should help
an agent advance an agreed outcome while keeping the user's burden low. A valid
Markdown file cannot establish that behavior. First make the guidance format and package checks sound. Run a separate
decision exercise when evaluating behavior; a structural edit does not need to
launch an agent experiment automatically.

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

Include situations that start with the user's conversation, before any Goal or
success criteria exist. Let the evaluator frame the outcome and choose the next
action, then continue that situation with new evidence or user feedback. This
exposes a Goal narrowed to one convenient task, which tests with prewritten
criteria can miss. Pair exploratory work with bounded deliverables and achieved
outcomes so that keeping a discussion open does not become endless work or a
new approval requirement.

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

## Compare actual work after the format is ready

Supplement Q&A with small isolated workspaces when measuring tool behavior.
Keep the initial files, Goal data, user messages and allowed tools identical
between the saved baseline and candidate. Keep the rubric outside the agent's
accessible task materials and retain the exact selected model and settings.

Record reads, operations, resulting files and Goal state, questions, completion
claims and cost. Include interrupted work, later corrections and unanswered
Letters as well as ordinary success cases. Judge the usable outcome and scope
adherence, unnecessary questions, premature Done and the relevance of documents
read. Never use production queues, real recipients or live Goal data for these
exercises. Keep the cases and raw traces in an evaluation record, then report
comparisons with their limitations rather than inferring improvement from shorter
instructions alone.

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
