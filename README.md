# Facebook Simulator Revamp

Practice creating a Facebook advertising campaign and document the decisions for instructor evaluation.

This independent MARK 4360 classroom tool follows one campaign, one ad set, and one ad through setup, review, and practice publication. Contextual learning windows explain the settings and ask students to articulate their reasoning. **The instructor grades strategy and effectiveness.** The app checks required setup fields and supported combinations; it generates no grades, performance outcomes, or simulated scenarios.

**[Open the simulator](https://mralexgarrido.github.io/mark4360_fb/)** · [Student guide](REFERENCE_MANUAL.md) · [Maintainer guide](MAINTAINING.md)

## Student workflow

| Level | Practice |
| --- | --- |
| Campaign | Name the campaign; choose an objective, special category, and optional spending limit. |
| Ad set | Configure conversion location, performance goal, budget, schedule, audience, and placements. |
| Ad | Configure identity, uploaded media or image URL, single-image or carousel creative, copy, CTA, and destination. |
| Review & publish | Resolve setup requirements, explain decisions, confirm practice publication, and export the assignment packet. |

Website, instant-form, messaging, and app paths expose different settings. Facebook and Instagram Feed and Stories previews illustrate selected placements. The destination preview shows configured content without submitting leads, sending messages, or visiting the destination.

Publication records an immutable local snapshot of campaign settings. Students can pause, resume, edit, and publish changes. This practices the publication motion; it does not model Meta approval, delivery, spending, or outcomes.

## Assignment files and saved work

- **Save campaign file** downloads a versioned JSON file that can restore the draft, publication, explanations, and local process record in another browser.
- **Download assignment HTML** creates a readable packet with full settings, previews, carousel sequence, destination content, student explanations, and process record. Uploaded assets are embedded. External image URLs still depend on their provider.
- **Print / Save PDF** opens the browser print dialog. Images finish loading before printing; unavailable images are identified before opening the print dialog. Current draft and published settings can be exported separately. Published packets explicitly include current student explanations.
- **New campaign** asks before replacing the draft and offers a download first.

Automatic saving writes edits immediately through localForage in the current site and browser, coalesces pending edits in order, and confirms only the newest completed save. Leaving while work remains unsaved triggers a browser warning. Clearing site data removes local work. Visible warnings explain storage failures; unrecognized stored drafts remain available for recovery rather than being overwritten. Older flat drafts are migrated when supported, with new settings inferred for review. Keep a campaign file for work that matters.

Submit the packet through the instructor's designated channel. The app does not submit to an LMS. Timestamps and history are local, editable records, not verified proof of authorship.

## Development

Use Node.js 22.14 or newer and npm:

```sh
npm ci
npm run dev
```

Checks and production preview:

```sh
npm test
npm run lint
npm run build
npm run preview
```

No dependencies were added for this revamp. The Node test runner covers objective paths, validation, legacy migration, safe imports, publication isolation, file round trips, and server-rendered report content using the existing Vite toolchain. React provides the interface, localForage provides browser storage, and Vite builds the application. Existing dependencies remain pinned by the lockfile.

Vite retains `base: './'` and writes generated assets into `docs/`. Keep source documentation outside that folder. GitHub Pages can serve the committed build; any production merge or deployment requires maintainer approval.

| Path | Responsibility |
| --- | --- |
| `src/components/` | Setup forms, learning dialogs, previews, review, and assignment report |
| `src/context/AdCampaignContext.jsx` | Workspace state, saving, publication, and exports |
| `src/lib/campaign.js` | Field transitions, validation, migration, and versioned campaign files |
| `src/data/` | Bundled teaching content and represented platform options |
| `src/report.css` | Standalone HTML and print packet layout |
| `tests/` | Dependency-free campaign logic regression tests |

## Scope and support

The workflow represents a manual classroom subset of Ads Manager, not full interface parity. It uses USD, one campaign/ad set/ad, image and carousel media, and four represented placements. Audience locations, interests, custom audiences, datasets, and account identities are planning descriptions. No account APIs, targeting databases, tracking integrations, or external content services are required for the exercise. There is no performance dashboard or automated strategic recommendation.

Use [GitHub Issues](https://github.com/mralexgarrido/mark4360_fb/issues) for reproducible bugs and teaching improvements. Use fictional data and do not attach student records or account credentials. See [documentation/REVAMP.md](documentation/REVAMP.md) for implementation boundaries and validation status.

Maintained by [Alex Garrido](https://github.com/mralexgarrido). This project is independent of Meta and is not endorsed by Meta, Facebook, or Instagram. No project-level license is currently included; contact the owner about reuse.
