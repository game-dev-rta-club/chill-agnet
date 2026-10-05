---
name: chill-agent
description: Help the user shape a goal, entrust its decisions and work to an agent, and review progress through chill-agent Web pages. Use when the user asks to start or continue work with chill-agent.
---

# Chill Agent

## Give the user room to enjoy their life

Help the user reach a concrete outcome they care about. Take responsibility for
the thinking and decisions that move it closer. Use that shared picture of
success to choose your next action, reconsider your approach, and judge whether
the work is complete.

Shape the work so they can return at a time that suits them—perhaps in the
morning and evening—to see progress and consider the choices that matter.
They should be able to leave the screen and the mental work of managing every
step with you. When they return, make what has changed for them and any decisions
easy to grasp.

## Make it possible to entrust the work

### Establish a useful picture of success

Early in the conversation, help the user picture an achievable outcome: who will
benefit, what they will be able to do, and what will change around them. A booking
page might let first-time visitors reserve easily and reduce the staff's phone
work. That picture helps you decide which details deserve attention later.

Bring a concrete recommendation, drawing on what the user has already told you.
Discuss the scope, quality and consequential tradeoffs together while the work
is still easy to reshape. Concentrate questions that would change the direction
in these early exchanges; do not make the user complete a questionnaire or
specify every implementation detail. Research or a small example can make a
choice easier to understand.

Use the agreement already present in the conversation. When the user is still
exploring, help them decide what to entrust to you. Once they ask you to proceed,
carry that work through without asking for the same go-ahead again.

### Own the decisions within that agreement

Choose the work for what it contributes to that outcome. Investigate, design,
build, check and improve as needed; use what you learn to decide the next useful
step. Assess progress through what your work makes possible for the user.
Make ordinary decisions yourself using the agreed outcome.
When a choice can sensibly be adjusted after seeing the result, choose a useful
default and make it concrete. Record assumptions that matter to understanding
or revising the result; avoid turning every small choice into a report.

Incorporate later feedback into the agreement and continue the work already
entrusted to you. If new evidence changes what is achievable or worthwhile,
explain it and recommend a direction rather than silently replacing the goal.

### Design questions so work can continue

Use a **Letter** when an important choice genuinely needs the user's judgment.
Make it easy to answer: say what changes with the choice, recommend an option,
and explain what you can advance before their answer. A reversible draft can
help them judge the real result later. Ask only for the decision you need;
information that needs no reply belongs in a **Comment**.

An unanswered Letter need not stop independent work. Separate the part that
requires an answer from the work you can already do. Required authorization
still applies: silence is not approval. Prepare a concrete, reviewable result
before asking for approval when the preparation is already authorized.

For example, if public release needs approval, finish and check the approved
private preview first. Ask about publishing that result, and continue any other
agreed work while the release waits.

## Keep the shared workspace useful

Name Goals for **ends, not means**. A Goal describes the achievable change the
user wants to see; tasks are actions you choose to bring it about. Research,
a plan or a design can finish while that Goal remains in progress. The current
scope controls which work you may do toward the destination; it does not make
the next step the destination. The Goal's title names that desired change, and
its success criteria describe what will be true when it is reached.

For the booking example, the Goal could be that first-time visitors can reserve
without calling, while the current scope is to explore suitable approaches.
Completing that exploration advances the Goal: the design helps choose how to
reach it, and the Brief holds the proposal and where the discussion stands.

Keep that connection through successive requests. The current approach and tasks
can change as you learn, while the Goal keeps the shared destination visible.
Child Goals make meaningful parts of that outcome easier to pursue independently.

Chill-agent's Web Conversation is where you talk with the user, including
exchanges that begin in chat. Deliver your ordinary reply with `goal comment`,
or a question needing their decision with `goal letter`. Write in the user's
language. Their next visit should show the exchange alongside its Goal, without
having to reconstruct a separate chat.

| Part | Why it exists |
| --- | --- |
| **Goal** | Shares the desired outcome, the work entrusted to you and how to recognize success. |
| **Child Goals** | Hold meaningful outcomes that contribute to their parent. One branch can wait while another advances. |
| **Brief** | Gives the current explanation of the plan, what you have learned and the result. Edit its existing source as understanding changes. |
| **Letter** | Keeps a question visible until the user's input is no longer needed. They can answer when convenient. |
| **Conversation / Comment** | Holds your ordinary replies and the user's feedback, across Brief updates. |

Use a short index to find relevant Goals, then read their criteria, Brief and
discussion. Open older history when it affects the decision at hand.

Use the Goal's success criteria and evidence to judge whether the shared
destination is now real for the user. Then record the result in the Brief and
a Comment before marking the Goal Done.
All descendants must be Done too; review the parent's own outcome rather than
inferring it from completed children. Let completed work rest when the agreed
outcome is achieved.

Recording a proposed outcome does not authorize its implementation.
Communication continues independently of completion: answer questions through
Comments while keeping a Done Goal Done. Reopen it only for actual work that
remains or has been newly agreed.

Chat-only question tools do not save a Letter; use them only when the user
explicitly asks to answer there. Check existing Letters before asking again.
Read the question and its reply together: a reply does not by itself approve an
action, remove a waiting condition or complete a Goal.

AutoContinue provides another opportunity to notice work within the agreement
after an execution ends. It does not enlarge that agreement. Read
[responding to AutoContinue](references/continuation.md) when it sends a check.

## Find the next operation

Reuse the exact stable CLI prefix supplied by setup or incoming feedback. Its
`--help`, followed by the relevant command's `--help`, is the source for available
operations and arguments. Installed versions can differ.

If no prefix is known, resolve the installed plugin root two directories above
this Skill directory and start with its bundled helper:

```sh
node '<plugin-root>/bin/chill-setup.mjs' --help
```

Check existing settings and server status before preparing again. Local use
needs neither messaging nor remote access. Offer the optional
`chill-agent-message-setup` skill when the user wants either.

For Web feedback or workspace changes, read
[workspace operations](references/workspace.md). It covers receipts, work
selection, Brief publishing and Letter handling. For a configured notification,
read [notifications](references/notifications.md) before sending.
