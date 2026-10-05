---
keyPoints: >-
  Report vulnerabilities privately with version and reproduction details, without
  private workspace data. Security support has no guaranteed response or release schedule.
---

# Security Policy

## Maintenance status

chill-agent is experimental. It does not publish a guaranteed security
support schedule. Reports may be addressed on the current `main` branch and the
most recent tagged release, subject to maintainer availability.

Acknowledgement, remediation, release, and long-term maintenance timelines are
not guaranteed. Do not rely on this project when your use case requires a
contractual response or fix deadline.

## Report a vulnerability

Do not open a public GitHub issue with vulnerability details. Use
[GitHub private vulnerability reporting](https://github.com/game-dev-rta-club/chill-agnet/security/advisories/new).
Include:

- The affected version, operating system, and component.
- A description of the issue and its potential impact.
- Reproduction steps or a proof of concept where safe.
- Any known mitigations.
- Your intended disclosure timeline.

## Scope

This repository owns skills, continuation policy and the composed package. The
shared CLI, Web interface and extension host are maintained in
[chill-agent-cli](https://github.com/game-dev-rta-club/chill-agent-cli/blob/main/SECURITY.md).
If an issue crosses that boundary or you are unsure where it belongs, report it
privately here with the affected package versions.

Report vulnerabilities in third-party services to their upstream project. Do not
include private Goal data, credentials or user conversations in reports.

## Disclosure and attribution

Please avoid public disclosure until users have had a reasonable opportunity to
apply an available fix. This project cannot promise an embargo or remediation
timeline, so include your intended disclosure date in the report.

If an advisory is published, reporters are credited unless they request
otherwise.
