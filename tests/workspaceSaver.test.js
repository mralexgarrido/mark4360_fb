import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkspaceSaver } from '../src/lib/workspaceSaver.js';

const turn = () => new Promise(resolve => setImmediate(resolve));
test('rapid edits persist the newest draft in order and acknowledge only that draft', async () => {
  const writes = [], completions = [], saved = [];
  const saver = createWorkspaceSaver(value => {
    writes.push(value);
    return new Promise(resolve => completions.push(resolve));
  }, () => saved.push('saved'), assert.fail);
  saver.save('first'); saver.save('second'); saver.save('latest');
  assert.deepEqual(writes, ['first']);
  completions.shift()(); await turn();
  assert.deepEqual(writes, ['first', 'latest']);
  assert.deepEqual(saved, []);
  completions.shift()(); await turn();
  assert.deepEqual(saved, ['saved']);
});
test('an edit invalidates an older save before the next render queues its value', async () => {
  let complete;
  let saved = 0;
  const saver = createWorkspaceSaver(() => new Promise(resolve => { complete = resolve; }), () => ++saved, assert.fail);
  saver.save('old'); saver.markDirty(); complete(); await turn();
  assert.equal(saved, 0);
  saver.save('new'); complete(); await turn();
  assert.equal(saved, 1);
});
test('reset or import wins over an in-flight older draft', async () => {
  const writes = [], completions = [];
  const saver = createWorkspaceSaver(value => { writes.push(value); return new Promise(resolve => completions.push(resolve)); }, () => {}, assert.fail);
  saver.save({ campaign: 'old' }); saver.save({ campaign: 'edited' }); saver.save({ campaign: 'new blank workspace' });
  completions.shift()(); await turn(); completions.shift()(); await turn();
  assert.deepEqual(writes.map(value => value.campaign), ['old', 'new blank workspace']);
});
test('storage failure is reported and a later save can recover', async () => {
  let fail = true, saved = 0, errors = 0;
  const saver = createWorkspaceSaver(async () => { if (fail) throw new Error('quota'); }, () => ++saved, () => ++errors);
  saver.save('unsaved'); await turn();
  assert.equal(errors, 1); assert.equal(saved, 0);
  fail = false; saver.save('recovered'); await turn();
  assert.equal(saved, 1);
});
