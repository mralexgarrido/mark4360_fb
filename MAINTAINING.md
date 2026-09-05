# Maintainer guide

## Existing configuration

The package provides `dev`, `lint`, `build`, and `preview` scripts. Vite uses `base: './'`, writes into `docs/`, and empties that generated directory during a build. Keep documentation outside `docs/`.

Inspect **Settings > Pages** and any connected hosting dashboard before deployment to confirm the actual source branch, build command, and output. Committed build files are not proof of deployed settings. Do not add or migrate hosting as a side effect of a README update.

## Validation checklist

Run `npm ci`, `npm run lint`, and `npm run build`, then inspect the app with `npm run preview`. These are separate checks: record any lint failure even if the build succeeds.

Exercise all four steps with fictional data. Confirm automatic persistence across reload, review fields, preview rendering, external-image failure behavior, and reset. Inspect print preview, keyboard navigation, educational dialogs, and narrow-screen layout. No automated end-to-end test script is declared in the current package manifest.

Teaching copy should distinguish simulation estimates from real forecasts. Keep technical claims aligned with the manifest and source; do not claim accessibility certification, platform parity, or psychometric validation from a visual review.

## Updates and GitHub presentation

For a tested milestone, describe the student-visible improvements, fixes, known limitations, and upgrade implications in a release note tied to the reviewed commit. Do not manufacture historic release dates or publish a tag merely to make the repository look active.

Suggested About description: **Practice campaign, ad-set, and creative planning in an interactive social advertising learning tool.** Suggested topics: `marketing-education`, `social-advertising`, `react`, `vite`.

Set the About website to the verified hosted app. Use a real, current screenshot with fictional content for a social preview. These are repository settings; editing this document does not change them.

## Rollback

Keep documentation changes in their own pull request. Before merge, closing the PR leaves the default branch untouched. After an approved merge, revert the documentation commit through a separate PR and retain the prior working deployment. Even documentation-only merges can trigger a connected hosting build.
