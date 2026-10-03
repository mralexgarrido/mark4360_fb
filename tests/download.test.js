import test from 'node:test';
import assert from 'node:assert/strict';
import { fileName } from '../src/lib/download.js';
test('long campaign names retain distinct current and published assignment filenames', () => {
  const name = 'Campus Coffee Campaign With A Long Naming Convention '.repeat(20);
  const draft = fileName(name, 'html', 'draft-assignment');
  const published = fileName(name, 'html', 'published-assignment');
  assert.notEqual(draft, published);
  assert.ok(draft.endsWith('-draft-assignment.html'));
  assert.ok(published.endsWith('-published-assignment.html'));
  assert.ok(draft.length <= 85 && published.length <= 85);
});
test('campaign filenames have a safe stem and a usable fallback', () => {
  assert.equal(fileName('Coffee launch', 'json'), 'coffee-launch.json');
  assert.equal(fileName('!!!', 'json'), 'facebook-campaign.json');
  assert.equal(fileName('', 'html', 'draft-assignment'), 'facebook-campaign-draft-assignment.html');
  assert.ok(!fileName('../../a <b> / title', 'html').includes('/'));
});
