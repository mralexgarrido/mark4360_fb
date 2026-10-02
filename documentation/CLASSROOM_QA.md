# Classroom workflow QA: 2.0.1

## Purpose

Students practice campaign, ad set, creative, review, and publication steps, then document and export their work. The instructor evaluates effectiveness. No scenario engine, outcome projection, automated grades, new runtime service, or new dependency is introduced.

## Fixes

- Replace the 350 ms autosave delay with immediate ordered writes, coalescing pending edits. An older completed write cannot mark a newer edit saved. Warn on leaving while work is unsaved.
- Record field edits even without navigation, grouping consecutive typing. Persist and export the most recent 150 actions.
- Render HTML directly from a captured workspace snapshot, including pending edit information, rather than waiting for hidden DOM updates. Load the existing React renderer only when exporting.
- Wait for report images before printing; identify unavailable assets. Reset the report to the current draft after printing.
- Keep download blobs alive long enough for large files to start reading and attach download anchors for browser compatibility.
- Raise the campaign import limit to 320 MB so permitted uploaded media in draft and publication can be reopened. Each image remains limited to 10 MB.
- Cancel superseded/unmounted image reads; use the latest card callback and image description. Reset failed-image fallback on replacement.
- Give form headline and app name their own validation messages and focus targets. Keep media/card text limits consistent with import validation.
- Capture date/time input events immediately, including calendar and time controls.
- Put current HTML alongside PDF and published exports on final review, explaining readable submissions versus editable JSON backups. Identify paused/publication status in reports.

## Automated checks

`npm test`, `npm run lint`, `npm run build`, and `git diff --check` must pass. Native Node tests cover all 11 represented objective/destination combinations; structural validation; migration; imports; immutable publication; calendar arithmetic; tracking; large-file round trips; grouped process edits; ordered save/reset and storage-error recovery; bounded image readiness; and complete portable report content across all destinations. Reports preserve full long copy, long explanations, selected placements, carousel sequence, embedded images, form questions/privacy/completion, messages, app setup, and escaped text.

## Browser checks and limits

The live cloud browser exercised a fictional Traffic/Website campaign through review, explanation fields, publication confirmation, pause/resume, reload, preview expansion, selected placements, placement validation, two-card carousel reordering, and per-card tracked destination previews. An immediate reload reproduced the old pause/resume persistence failure.

Browser file-chooser attachment stalled and the download-event listener timed out. The environment also blocked localhost previews. These are verification limits, not evidence that ordinary student uploads/downloads work or fail. Actual student-device file upload, downloaded HTML reopening, JSON reopening via the picker, native PDF output, and phone/Safari/Firefox behavior require final manual confirmation. Do not describe this audit as a guarantee of perfect behavior or an accessibility certification.

## Quick instructor acceptance run

1. Open the live app and create a campaign with an uploaded classroom image.
2. Complete ad set and creative settings, explanations, and practice publication.
3. Download the current and published HTML. Reopen them and confirm images, full copy, settings, explanations, and process record.
4. Save a campaign JSON file, start a new campaign, reopen the JSON, and confirm draft/publication preservation.
5. Save a PDF through the browser print dialog and inspect every page. Repeat with carousel media and one other destination.
6. Confirm that all evaluation of strategy and effectiveness remains with the instructor.
