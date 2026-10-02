import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { blankWorkspace, applyCampaignField } from '../src/lib/campaign.js';

test('assignment renderer includes full creative, rationale, carousel order, and published settings', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
  try {
    const { AssignmentReportContent } = await server.ssrLoadModule('/src/components/AssignmentReport.jsx');
    const workspace = blankWorkspace();
    workspace.data = applyCampaignField(workspace.data, 'campaignObjective', 'traffic');
    Object.assign(workspace.data, { campaignName: 'Published campaign', primaryText: 'Full copy '.repeat(300) + 'END OF COPY',
      strategyDescription: 'Student explanation '.repeat(300) + 'END OF REASONING', websiteUrl: 'https://example.com/offer',
      adFormat: 'carousel', carouselCards: [
        { id: 'one', imageUrl: '', imageAlt: 'First image', headline: 'First card', websiteUrl: '' },
        { id: 'two', imageUrl: '', imageAlt: 'Second image', headline: 'Second card', websiteUrl: 'https://example.com/second' },
      ], studentName: '<script>alert("test")</script>' });
    workspace.publication = { publishedAt: '2026-10-01T10:00:00Z', paused: true, data: structuredClone(workspace.data) };
    workspace.data.campaignName = 'Unpublished draft name';
    workspace.data.primaryText = 'Unpublished draft text';
    const published = renderToStaticMarkup(createElement(AssignmentReportContent, { workspace, reportSource: 'published' }));
    assert.ok(published.includes('Published campaign settings with current student explanations'));
    assert.ok(published.includes('Published campaign'));
    assert.ok(!published.includes('Unpublished draft name'));
    assert.ok(published.includes('END OF COPY'));
    assert.ok(published.includes('END OF REASONING'));
    assert.ok(published.includes('Card 1: First card'));
    assert.ok(published.includes('Card 2: Second card'));
    assert.ok(published.includes('https://example.com/second'));
    assert.ok(published.includes('Facebook Stories'));
    assert.ok(published.includes('Instagram Feed'));
    assert.ok(published.includes('practice account · paused'));
    assert.ok(published.includes('&lt;script&gt;'));
    assert.ok(!published.includes('<script>'));
    const draft = renderToStaticMarkup(createElement(AssignmentReportContent, { workspace }));
    assert.ok(draft.includes('Unpublished draft name'));
    assert.ok(draft.includes('changes made after the recorded publication'));
    assert.ok(draft.includes('not independently verified evidence of authorship'));
  } finally {
    await server.close();
  }
});

test('every destination and all explanations survive a portable report with embedded media', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
  try {
    const { default: Report } = await server.ssrLoadModule('/src/components/AssignmentReportContent.jsx');
    const workspace = blankWorkspace();
    const asset = 'data:image/png;base64,iVBORw0KGgo=';
    Object.assign(workspace.data, { campaignName: 'Campaign', imageUrl: asset, primaryText: 'FULL CREATIVE',
      businessGoal: 'BUSINESS REASONING', strategyDescription: 'AUDIENCE REASONING', budgetRationale: 'BUDGET REASONING',
      creativeRationale: 'CREATIVE REASONING', measurementPlan: 'MEASUREMENT REASONING', revisionNotes: 'REVISION REASONING',
      placementMode: 'manual', placements: ['facebook-feed'], formName: 'Lead inquiry', formHeadline: 'Contact our business',
      formDescription: 'FORM INTRODUCTION', privacyUrl: 'https://example.com/privacy', thankYouMessage: 'FORM COMPLETION',
      messageGreeting: 'OPENING MESSAGE', appName: 'APP NAME', appUrl: 'https://example.com/app', websiteUrl: 'https://example.com/offer',
      urlParameters: 'utm_source=facebook' });
    workspace.events.push({ at: '2026-10-02T10:00:00Z', text: 'PROCESS ACTION' });
    for (const [destination, expected] of [
      ['website', ['https://example.com/offer?utm_source=facebook']],
      ['instant-form', ['Lead inquiry', 'FORM INTRODUCTION', 'Full name', 'Email', 'https://example.com/privacy', 'FORM COMPLETION']],
      ['messages', ['OPENING MESSAGE', 'Messenger']],
      ['app', ['APP NAME', 'Apple App Store', 'https://example.com/app?utm_source=facebook']],
      ['on-ad', ['FULL CREATIVE']],
    ]) {
      workspace.data.destination = destination;
      const html = renderToStaticMarkup(createElement(Report, { workspace }));
      for (const text of [...expected, 'BUSINESS REASONING', 'AUDIENCE REASONING', 'BUDGET REASONING', 'CREATIVE REASONING', 'MEASUREMENT REASONING', 'REVISION REASONING', 'PROCESS ACTION', asset]) assert.ok(html.includes(text), `${destination} omitted ${text}`);
      assert.ok(!html.includes('Instagram Stories'));
      assert.ok(!html.includes('<script'));
    }
  } finally { await server.close(); }
});
