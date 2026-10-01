# Facebook Simulator Revamp

Implementation prepared for instructor review on 2026-10-01. Production merge and deployment are separate approval steps.

## Teaching boundary

Students create their own campaign rather than encounter generated scenarios. The instructor evaluates strategy and effectiveness. Required-field and option validation supports the creation motion; it does not determine whether an audience, offer, creative, or budget is effective. Explanations are instructor-readable rather than automatically graded.

## Implemented scope

- Campaign/ad-set/ad hierarchy, six objectives, represented conversion locations and performance goals.
- Budget, schedule, time zone, category, audience descriptions, and four represented placements.
- Single-image and 2–10-card carousel creation, uploaded assets, placement previews, and destination inspection.
- Bundled learning windows with setting explanations, considerations, platform context, and reflection prompts.
- Local review, practice publication confirmation, published snapshot, pause/resume, and unpublished edits.
- Versioned saving, supported legacy migration, portable JSON restore, raw recovery, and replacement confirmation.
- Separate HTML/print assignment layout with settings, creative, destination, explanations, and qualified process record.

No new dependency, server, account connection, API, grading engine, targeting database, or performance engine was added. Existing hosting configuration and relative asset paths are retained.

## Deliberate simplifications

One campaign contains one ad set and one ad. Currency is USD. Supported media are images and carousels; video/Reels, catalog feeds, billing, policy review decisions, real delivery, experiments, and multi-ad management are outside this exercise. Advantage+ placements represents four previewable placements and does not reproduce every eligible live placement. Locations, targeting, dataset, and account identities are descriptive fields, not verified connections. Special-category controls are a classroom subset rather than a jurisdiction-specific compliance engine.

A single latest published snapshot is retained. Published packets combine recorded settings with current explanations and label this explicitly. The local process record is capped at 150 actions, is editable through exported files, and does not attest authorship.

## Validation

`npm ci`, all 23 regression checks, ESLint, and the production build passed. A server-rendered report check verifies full copy and explanations, all carousel cards, HTML escaping, and separate draft/published settings. This does not verify visual pagination. Tests cover all represented objective/location paths, setup failures, dependent controls, snapshot isolation, legacy migration, malformed imports, file round trips, placement/category controls, carousel requirements, dates, budgets, and URL parameters.

Visual interaction and actual print-preview validation could not be completed in this environment. Two attempts to open the local preview were blocked because the browser automatic approval check timed out before returning a decision. This was not an unsafe-action rejection. No bypass or production deployment was attempted. Run the manual checks in [MAINTAINING.md](../MAINTAINING.md) before approving a production release, particularly native-dialog behavior, image upload, browser saving, responsive layout, downloads, and pagination of long content.

## Review and rollback

Feature branch: `feat/facebook-simulator-revamp`. Baseline: `578abbed5ec4cda4cd1e8fd2021c083848a78a81`. Source and generated `docs/` output belong in the same reviewed change. Before merge, closing the PR leaves production untouched. After approval, revert through a reviewed PR and rebuild the deployment output. Preserve students' JSON backups before any storage downgrade.
