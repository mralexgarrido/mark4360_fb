# Facebook Ads Simulator

Turn an advertising idea into a campaign plan you can explain, preview, and discuss.

This interactive MARK 4360 teaching tool introduces the campaign, ad-set, and creative decisions behind social advertising. Students can practice with fictional brands, review their choices, and prepare a printable strategy summary without connecting a real advertising account.

**[Open the simulator](https://mralexgarrido.github.io/mark4360_fb/)** · [User guide](REFERENCE_MANUAL.md) · [Report an issue](https://github.com/mralexgarrido/mark4360_fb/issues)

## The learning workflow

| Step | Practice |
| --- | --- |
| Campaign | Define the campaign name, objective, buying type, and campaign-level settings. |
| Ad set | Plan the budget, schedule, location, demographics, and audience. |
| Ad creative | Develop the identity, image, copy, destination, and call to action. |
| Review & Submit | Review the campaign and write the strategic reasoning behind the choices. |

The application includes contextual educational explanations, an ad preview, browser-local draft persistence, and print output. Budgets, estimates, and strength indicators are teaching aids, not live Meta campaign data or validated forecasts.

## Try it in class

Choose a fictional business and a measurable objective. Complete the four steps, then ask a partner to identify whether the audience, offer, creative, and destination support that objective. In the review step, explain one tradeoff you made and what you would test next.

Use the print control to open the browser's print dialog and save a PDF when needed. **Review & Submit does not submit work to a learning management system.** Follow the instructor's separate submission instructions.

Campaign changes are saved automatically in this browser using localForage. Saved work does not follow you to another device or browser. Clearing site data removes it. Export the review before using the finish/reset action, and use fictional information on shared computers. External image URLs may load content from the image provider; browser-local storage is not a claim that the page makes no network requests.

## Local development

Use Node.js 22.14 or newer within the Node.js 22 release line and npm:

```sh
git clone https://github.com/mralexgarrido/mark4360_fb.git
cd mark4360_fb
npm ci
npm run dev
```

Open the address printed by Vite. Available checks and preview commands are:

```sh
npm run lint
npm run build
npm run preview
```

The current Vite configuration uses relative asset paths (`base: './'`) and writes the production build to **`docs/`**. That folder is generated output, not the location for source documentation. Preserve `package-lock.json`; investigate install failures rather than replacing dependencies indiscriminately.

## Architecture

React provides the interface, Tailwind CSS provides styling, Recharts supports the budget visualization, and localForage persists campaign data. Vite builds the application. See [package.json](package.json) for the complete dependency list.

| Path | Responsibility |
| --- | --- |
| `src/components/` | Campaign steps, preview, educational dialogs, and review |
| `src/context/AdCampaignContext.jsx` | Shared campaign state, automatic persistence, and reset |
| `src/data/` | Teaching content |
| `vite.config.js` | Relative base path and `docs/` build output |
| `legacy/` | Earlier implementation, separate from the current React source |

## Support and maintenance

Use [GitHub Issues](https://github.com/mralexgarrido/mark4360_fb/issues) for reproducible bugs and teaching improvements. Include the step, browser, expected result, and actual result using fictional data. Do not attach student records, account credentials, or real customer lists.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance and [MAINTAINING.md](MAINTAINING.md) for validation and release checks. Maintained by [Alex Garrido](https://github.com/mralexgarrido).

This independent educational project is not Meta Ads Manager and is not endorsed by Meta, Facebook, or Instagram. Platform names and marks belong to their respective owners. No project-level `LICENSE` file is currently included; contact the repository owner about reuse.
