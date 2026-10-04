# Continuation monitoring — working draft

Status: design notes from Goal #28, feedback #296, #298, #302 and #304 (2026-10-04).
The revised monitor, two-nudge limit, 30-second polling and dedicated result
route are implemented in development source. This wording remains a draft for
final polishing. Check installed CLI help before use.

## Purpose and boundaries

Ask an idle Agent to find work it can advance within the user's agreed purpose.
An unanswered Letter does not rule out independent work. Even when every Goal
is Done, check for missing work needed to fulfill the agreement; add a Goal
when justified by that agreement, not merely to keep the monitor busy.
Do not expand the agreed scope or override a user's stop instruction.

The intended separation is:

- chill-agent-cli owns data, Web, harness observation and delivery.
- chill-agent owns the skill, server startup orchestration and monitor policy.
- Monitor requests and their results travel monitor → Agent → monitor.
  They are not user feedback and do not create Web Conversation messages.

## Checking and counting

- Check every 30 seconds using one polling loop. Do not
  also add event-driven checks. Send when the conditions are met, without the
  previous fixed two-minute idle window or five-minute follow-up delay.
- Do not exclude work because of Goal state or an unanswered Letter.
- Check the assigned chat's running turn, pending deliveries, complete queue,
  and explicit pause. Uncertain state or receipt must not produce duplicate work.
- Send at most **two total nudges** since the last relevant change. The first
  nudge counts as 1; the second is the final check for that revision.
- Relevant changes include user feedback and substantive Goal/Brief updates.
  Identical saves and bookkeeping timestamps do not reset the count.
- Monitor requests/results, delivery updates, heartbeats and Agent reply
  comments alone do not reset it. Persist counts across monitor restarts.
- A no-work response consumes its nudge; it does not suppress the second check
  or start a fresh allowance. Confirm actual turn completion and an empty queue
  before sending again. A result callback alone does not prove the turn ended.

## Agent response and Web visibility

Use readable sections like User Feedback: Context, Message, Next Actions.
Summarize why the monitor believes the chat is idle in natural language. Include
only useful identifiers and check number, rather than a raw diagnostic dump.

For work that produces a real result or requires a user decision, use the usual
Brief, Comment and Letter workflow. For a no-work check, return the result to
the monitor's dedicated result route without a Web Comment, Letter or Brief edit.
Keep the internal result so no-work can be distinguished from delivery failure.
Exclude those records from change detection in code, not just by prompting.

Proposed Next Actions wording:

> 合意した目的に向けて、今進められる仕事があれば、そのまま進めてください。
> Letterの回答待ちでも独立して進められる部分を探し、全Goalが完了していても
> 必要な作業の見落としがないか見直してください。
> 作業不要の場合は、その旨をWebのComment・Letter・Briefに書き込まず、
> この要求で指定された監視専用の結果経路へ返してください。監視への返答が
> 新しい変更や通知として循環することを避けるためです。実際の成果や
> ユーザーの判断が必要な問いは、通常どおりWebに残してください。

The incoming request includes the exact command:
`monitor result --id <ROOT> --attempt <UUID> --outcome worked` or
`--outcome no-work`. It requires the assigned chat's CODEX_THREAD_ID.
This records a result only; the monitor separately verifies turn completion.
If the command is unavailable in the installed runtime, do not claim success
or substitute an automatic no-work Web comment. Ordinary user feedback still
receives its normal response.

## Tone of the two nudges

Nudge 1 should invite progress: 「今進められるところがあれば、そのまま進めてください。」

Nudge 2 should communicate consequence and responsibility without inventing
new authority. Proposed wording:

> この変更に対する最後の自動確認です。ここで進められる仕事を見落とすと、
> 次の変更やユーザーの介入まで作業が止まったままになる可能性があります。
> あなたの役割は、合意した仕事を進め、ユーザーが安心して任せられる状態に
> することです。chill-agentのSKILL.mdを読み直し、本当に今進められる仕事が
> ないか、もう一度確かめ、進められる箇所があればそのまま進めてください。

Both nudges preserve existing permissions, explicit pauses and agreed scope.
