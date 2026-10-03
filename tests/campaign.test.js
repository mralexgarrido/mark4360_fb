import test from 'node:test';
import assert from 'node:assert/strict';
import { objectives, getGoals, getCTAs } from '../src/data/platformOptions.js';
import {
  blankCampaign, blankWorkspace, applyCampaignField, publicationSnapshot,
  validateCampaign, migrateWorkspace, exportWorkspace, importWorkspace,
  campaignChanged, budgetSummary, selectedPlacements, trackedUrl, isImageSource,
  MAX_IMPORT_BYTES,
  recordFieldEdit,
} from '../src/lib/campaign.js';
const image = 'data:image/png;base64,iVBORw0KGgo=';
function configured(objective = 'traffic', destination = 'website') {
  let data = applyCampaignField(blankCampaign(), 'campaignObjective', objective);
  data = applyCampaignField(data, 'destination', destination);
  return { ...data, campaignName: 'Class campaign', adSetName: 'Local audience', adName: 'Offer image',
    budgetAmount: '20', startDate: '2026-10-01', endDate: '2026-10-07', locations: 'Edinburg, Texas',
    facebookPage: 'Fictional business', primaryText: 'Offer details.', headline: 'Explore the offer', imageUrl: image,
    websiteUrl: 'https://example.com/offer', datasetName: 'Practice dataset', messageGreeting: 'How can we help?',
    appName: 'Practice app', appUrl: 'https://example.com/app', formName: 'Inquiry', formHeadline: 'Get details',
    privacyUrl: 'https://example.com/privacy' };
}
for (const objective of objectives) {
  for (const destination of objective.destinations) {
    test(`${objective.label}: ${destination} can publish with setup fields and no graded explanation`, () => {
      const data = configured(objective.id, destination);
      assert.deepEqual(validateCampaign(data), []);
      const published = publicationSnapshot(data);
      assert.equal(published.data.businessGoal, '');
      assert.equal(published.data.strategyDescription, '');
      assert.equal('score' in published, false);
      assert.equal('results' in published, false);
      assert.ok(getGoals(objective.id, destination).includes(data.performanceGoal));
      assert.ok(getCTAs(destination).includes(data.callToAction));
    });
  }
}
test('blank and malformed settings cannot publish', () => {
  assert.equal(publicationSnapshot(blankCampaign()), null);
  const data = { ...configured(), budgetAmount: '-50', locations: '', websiteUrl: 'javascript:alert(1)', endDate: '2026-09-30' };
  const fields = validateCampaign(data).map(error => error.field);
  for (const field of ['budgetAmount', 'locations', 'websiteUrl', 'endDate']) assert.ok(fields.includes(field));
  assert.equal(publicationSnapshot(data), null);
});
test('field edits are recorded before navigation or export, with consecutive typing grouped', () => {
  let events = [];
  for (let index = 0; index < 200; index++) events = recordFieldEdit(events, 'primaryText', `typing-${index}`);
  assert.equal(events.length, 1);
  assert.equal(events[0].at, 'typing-199');
  events = recordFieldEdit(events, 'measurementPlan', '2026-10-02T10:00:00Z');
  const workspace = { ...blankWorkspace(), data: configured(), events };
  assert.deepEqual(importWorkspace(exportWorkspace(workspace)).events, events);
  assert.equal(events[1].text, 'Edited measurementPlan.');
});
test('large self-exported campaigns above the former 80 MB cap can be reopened intact', () => {
  const asset = 'data:image/png;base64,' + 'A'.repeat(7 * 1024 * 1024);
  const workspace = { ...blankWorkspace(), data: configured() };
  workspace.data.adFormat = 'carousel';
  workspace.data.carouselCards = Array.from({ length: 6 }, (_, index) => ({ id: `card-${index}`, imageUrl: asset, imageName: `image-${index}.png`, imageAlt: `Image ${index}`, headline: `Card ${index}`, websiteUrl: '' }));
  workspace.publication = publicationSnapshot(workspace.data);
  const text = exportWorkspace(workspace);
  assert.ok(Buffer.byteLength(text) > 80 * 1024 * 1024);
  assert.ok(Buffer.byteLength(text) < MAX_IMPORT_BYTES);
  const restored = importWorkspace(text);
  assert.equal(restored.data.carouselCards.length, 6);
  assert.equal(restored.data.carouselCards[5].imageUrl.length, asset.length);
  assert.equal(restored.publication.data.carouselCards[5].headline, 'Card 5');
});
test('missing form and app fields identify the exact control to fix', () => {
  const app = { ...configured('app-promotion', 'app'), appName: '', appUrl: 'bad' };
  const form = { ...configured('leads', 'instant-form'), formName: '', formHeadline: '' };
  assert.ok(validateCampaign(app).some(error => error.field === 'appName'));
  assert.ok(validateCampaign(app).some(error => error.field === 'appUrl'));
  assert.ok(validateCampaign(form).some(error => error.field === 'formName'));
  assert.ok(validateCampaign(form).some(error => error.field === 'formHeadline'));
});
test('calendar dates, time zone, and lifetime schedule are structural requirements', () => {
  const data = { ...configured(), startDate: '2026-02-30', endDate: '', budgetType: 'lifetime', timezone: 'invalid/zone', startTime: '25:00' };
  const fields = validateCampaign(data).map(error => error.field);
  for (const field of ['startDate', 'endDate', 'timezone', 'startTime']) assert.ok(fields.includes(field));
  assert.ok(validateCampaign({ ...configured(), budgetAmount: 'Infinity' }).some(error => error.field === 'budgetAmount'));
});
test('objective and location changes update dependent controls without losing creative or explanations', () => {
  const initial = { ...configured(), strategyDescription: 'Student reasoning', callToAction: 'shop-now' };
  const leads = applyCampaignField(initial, 'campaignObjective', 'leads');
  const form = applyCampaignField(leads, 'destination', 'instant-form');
  assert.equal(form.performanceGoal, 'Maximize leads');
  assert.equal(form.callToAction, 'sign-up');
  const app = applyCampaignField(form, 'campaignObjective', 'app-promotion');
  assert.equal(app.destination, 'app');
  assert.equal(app.performanceGoal, 'Maximize app installs');
  assert.equal(app.primaryText, initial.primaryText);
  assert.equal(app.imageUrl, initial.imageUrl);
  assert.equal(app.strategyDescription, initial.strategyDescription);
});
test('publication snapshot remains unchanged after editing, with documentation tracked separately', () => {
  const data = configured();
  data.carouselCards = [{ id: 'original', imageUrl: image, headline: 'Card one', websiteUrl: '' }];
  const publication = publicationSnapshot(data);
  data.primaryText = 'Changed offer';
  data.carouselCards[0].headline = 'Changed card';
  assert.equal(publication.data.primaryText, 'Offer details.');
  assert.equal(publication.data.carouselCards[0].headline, 'Card one');
  assert.equal(campaignChanged(data, publication), true);
  const annotated = { ...publication.data, businessGoal: 'New explanation', studentName: 'Student' };
  assert.equal(campaignChanged(annotated, publication), false);
});
test('legacy flat draft migrates intact and infers new controls', () => {
  const legacy = { campaignName: 'Existing student work', campaignObjective: 'traffic', budgetAmount: 50,
    imageUrl: image, primaryText: 'Original copy', websiteUrl: 'https://example.com/old',
    callToAction: 'shop-now', studentName: 'Student', strategyDescription: 'Original reasoning' };
  const restored = migrateWorkspace(legacy);
  for (const field of ['campaignName', 'primaryText', 'imageUrl', 'studentName', 'strategyDescription']) assert.equal(restored.data[field], legacy[field]);
  assert.equal(restored.data.budgetAmount, '50');
  assert.equal(restored.data.destination, 'website');
  assert.equal(restored.data.callToAction, 'shop-now');
  assert.equal(restored.schemaVersion, 2);
  assert.deepEqual(restored.events, []);
  assert.equal(restored.publication, null);
});
test('campaign file round trip preserves settings, published version, history, and explanations', () => {
  const workspace = { ...blankWorkspace(), data: configured(), currentStep: 3,
    events: [{ at: '2026-10-01T10:00:00Z', text: 'Published locally.' }] };
  workspace.publication = publicationSnapshot(workspace.data);
  workspace.publication.paused = true;
  workspace.data.primaryText = 'Revised draft';
  workspace.data.strategyDescription = 'Student reasoning';
  const restored = importWorkspace(exportWorkspace(workspace));
  assert.deepEqual(restored, workspace);
  assert.equal(campaignChanged(restored.data, restored.publication), true);
});
test('invalid imports fail before replacing work', () => {
  for (const text of ['broken JSON', 'null', '{}', JSON.stringify({ format: 'mark4360-facebook-campaign', schemaVersion: 2, workspace: null }),
    JSON.stringify({ format: 'mark4360-facebook-campaign', schemaVersion: 2, workspace: { schemaVersion: 2 } })]) assert.throws(() => importWorkspace(text));
  assert.throws(() => migrateWorkspace({ schemaVersion: 99, data: configured() }), /unsupported/);
  assert.throws(() => migrateWorkspace({ schemaVersion: 2, data: { ...configured(), imageUrl: 'data:text/html;base64,PHNjcmlwdD4=' } }), /image/);
  assert.throws(() => migrateWorkspace({ ...configured(), campaignName: { nested: 'invalid' } }), /Invalid field/);
});
test('imports use known fields and bounded event records', () => {
  const source = JSON.parse(JSON.stringify({ ...blankWorkspace(), data: { ...configured(), unexpected: 'ignored' },
    currentStep: 99, events: Array.from({ length: 200 }, (_, i) => ({ at: '2026-10-01', text: String(i), extra: 'ignored' })) }));
  source.data.__proto__ = { poisoned: true };
  const restored = migrateWorkspace(source);
  assert.equal(restored.data.unexpected, undefined);
  assert.equal(restored.data.poisoned, undefined);
  assert.equal(restored.currentStep, 0);
  assert.equal(restored.events.length, 150);
  assert.deepEqual(Object.keys(restored.events[0]), ['at', 'text']);
});
test('manual placement selection and special-category controls are enforced', () => {
  let data = { ...configured(), placementMode: 'manual', placements: [], ageRange: '18-24', gender: 'women' };
  assert.ok(validateCampaign(data).some(error => error.field === 'placements'));
  data = applyCampaignField(data, 'specialCategory', 'housing');
  assert.equal(data.ageRange, '18-65+');
  assert.equal(data.gender, 'all');
  data = applyCampaignField(data, 'placementMode', 'advantage');
  assert.equal(selectedPlacements(data).length, 4);
});
test('carousel validation checks card content, sequence limits, and website overrides', () => {
  const data = { ...configured(), adFormat: 'carousel', carouselCards: [
    { id: 'one', imageUrl: image, imageName: '', imageAlt: '', headline: 'One', websiteUrl: '' },
    { id: 'two', imageUrl: image, imageName: '', imageAlt: '', headline: 'Two', websiteUrl: 'https://example.com/two' },
  ] };
  assert.deepEqual(validateCampaign(data), []);
  assert.equal(publicationSnapshot(data).data.carouselCards[1].headline, 'Two');
  assert.ok(validateCampaign({ ...data, carouselCards: data.carouselCards.slice(0, 1) }).some(error => error.field === 'carouselCards'));
  data.carouselCards[1].websiteUrl = 'bad URL';
  assert.ok(validateCampaign(data).some(error => error.message.includes('Card 2')));
});
test('budget arithmetic is calendar-based and tracking parameters preserve URL parts', () => {
  const data = { ...configured(), budgetAmount: '10', startDate: '2026-03-07', endDate: '2026-03-09' };
  assert.match(budgetSummary(data), /\$30\.00 planned across 3 calendar days/);
  assert.match(budgetSummary({ ...data, budgetType: 'lifetime' }), /\$10\.00 lifetime budget.*\$3\.33/);
  const url = new URL(trackedUrl({ ...data, websiteUrl: 'https://example.com/offer?existing=1#details', urlParameters: '?utm_source=facebook&utm_campaign=Fall+offer' }));
  assert.equal(url.searchParams.get('existing'), '1');
  assert.equal(url.searchParams.get('utm_campaign'), 'Fall offer');
  assert.equal(url.hash, '#details');
  assert.equal(isImageSource('javascript:alert(1)'), false);
  assert.equal(isImageSource('data:image/svg+xml;base64,PHN2Zz4='), false);
});
test('website tracking parameters do not leak into an app destination', () => {
  const data = { ...configured('app-promotion', 'app'), appUrl: 'https://example.com/app?store=apple', urlParameters: 'utm_source=old-website' };
  assert.equal(trackedUrl(data), 'https://example.com/app?store=apple');
  assert.equal(trackedUrl({ ...data, destination: 'messages' }), '');
});
