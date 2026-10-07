---
keyPoints: >-
  Edit and publish the existing Brief as the current explanation. Preserve a
  clear distinction between proposals, agreed work and verified results.
---

# Update the Brief

Use this when the current explanation changes. Someone opening the Goal should
understand the desired result, current shape and what has actually been achieved
without piecing together a progress log.

Read the current Brief and the feedback that changes it. Edit its existing
source, rewriting superseded explanations instead of appending conflicting
versions. Lead with the result or current proposal and support it with the
detail needed to decide or use it. Link to concrete artifacts and evidence;
make proposals, agreed scope and verified behavior distinguishable.

Write new and revised Briefs as standalone HTML. Use `goal brief path --id <ID>
--format html` to find its editable source, then publish with `goal brief update
--id <ID> --format html`. When the current Brief is Markdown, carry its current
explanation into that HTML source; leave historical versions intact. An edited
local file alone does not change Web. Verify the saved version before claiming
the explanation has been updated.

Use readable headings, paragraphs and responsive tables or diagrams where they
help. Keep the project's established colors and visual tone. HTML is isolated
from the workspace: scripts and forms do not run. Upload raster images through
`goal image` and use its `/api/images/<id>` URL; inline SVG also supports image
annotations. Internal Goal links use `/#/goal/<ID>` so they resolve outside the
Brief document's URL. Installed help describes the command details.

Brief history preserves previous versions. Ordinary replies and progress belong
in Conversation; use a Comment to point out the meaningful change. A Brief
publication neither completes a Goal nor substitutes for that reply.
