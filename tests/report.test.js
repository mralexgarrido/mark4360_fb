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
    workspace.publication = { publishedAt: '2026-10-01T10:00:00Z', paused: false, data: structuredClone(workspace.data) };
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
