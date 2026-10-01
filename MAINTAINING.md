# Maintainer guide

## Configuration and checks

Use the pinned lockfile and run `npm ci`, `npm test`, `npm run lint`, and `npm run build`. Tests use Node's built-in runner with no added packages. Lint excludes generated `docs/` output and checks source and test files.

Vite retains relative asset paths (`base: './'`), generates `docs/`, and empties that folder at build time. Keep source documentation outside it. Tailwind scans only `src/` so previously generated bundles cannot change the next build. Include the generated build in a reviewed release because the existing GitHub Pages setup serves committed output. The existing Cloudflare configuration is retained without changes.

Inspect actual hosting settings before a release. Do not infer deployment from the presence of generated files, migrate hosting, or change authentication as part of routine UI maintenance. A production merge or deployment requires owner approval.

## Manual validation before release

Exercise the four steps with fictional data, including the website, instant-form, messaging, and app paths. Confirm objective/location dependency updates, positive budget validation, lifetime schedule validation, manual placements, image upload/failure handling, carousel reordering, destination previews, and publication confirmation.

Verify browser saving across reload, old-draft migration, JSON export/import, reset confirmation, and storage warnings. Publish, edit settings, compare current/published reports, and republish. Verify that explanation edits do not create a false unpublished campaign-change status.

Inspect keyboard operation, modal focus containment and restoration, Escape dismissal, narrow-screen previews, HTML export, and actual print preview with long copy, long explanations, and all carousel cards. Unit tests and a build do not prove browser interaction or print layout.

Keep learning content descriptive. Do not reintroduce automatic quality scores, strategic judgments, result projections, or scenario engines. The instructor grades effectiveness. Label simplified platform controls and represented placements, and avoid claiming full account parity or accessibility certification.

## Storage and upgrades

Version 2 uses `fbAdsSimWorkspace_v2` and migrates supported flat `fbAdsSimData` drafts. Unknown/corrupt stored data blocks automatic overwriting and offers a raw recovery download. The old key is removed when the student explicitly starts a new campaign. JSON export preserves one current workspace and its latest published snapshot; it is not a multi-campaign archive.

Preserve the format identifiers and add explicit migration rules before changing the schema. Imported timestamps and histories are unverified, editable local records. Do not treat them as grading evidence by themselves.

## Deployment and rollback

Review [documentation/REVAMP.md](documentation/REVAMP.md) and the PR validation record. Before approval, the feature branch and PR are the reviewable artifacts; the production default branch stays unchanged. After an approved release, rollback through a reviewed revert and rebuild `docs/`. Consider recovery/export implications before reverting to a version that cannot read new drafts.

The pre-revamp baseline is `578abbed5ec4cda4cd1e8fd2021c083848a78a81`. Closing an unmerged revamp PR leaves that baseline unchanged.
