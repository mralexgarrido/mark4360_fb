import test from 'node:test';
import assert from 'node:assert/strict';
import { waitForReportImages } from '../src/lib/reportImages.js';
const report = images => ({ querySelectorAll: () => images });
test('printing waits for pending images and identifies failed assets', async () => {
  const pending = Object.assign(new EventTarget(), { complete: false, naturalWidth: 0 });
  const ready = { complete: true, naturalWidth: 800 };
  const failed = { complete: true, naturalWidth: 0 };
  const result = waitForReportImages(report([ready, pending, failed]), 100);
  pending.complete = true; pending.naturalWidth = 800; pending.dispatchEvent(new Event('load'));
  assert.deepEqual(await result, [true, true, false]);
});
test('a stalled external image has a bounded wait instead of hanging the export', async () => {
  const stalled = Object.assign(new EventTarget(), { complete: false, naturalWidth: 0 });
  assert.deepEqual(await waitForReportImages(report([stalled]), 5), [false]);
  assert.deepEqual(await waitForReportImages(report([])), []);
});
