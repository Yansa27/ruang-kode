import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DraftSaver, type SaveStatus } from './draft-saver';

test('empty drafts and resets are saved, but unchanged drafts are not', async () => {
  const writes: string[] = [];
  const saver = new DraftSaver('starter', async code => { writes.push(code); }, () => {});
  await saver.flush();
  saver.update(''); await saver.flush();
  saver.update('starter'); await saver.flush();
  assert.deepEqual(writes, ['', 'starter']);
});

test('reports success only after the request completes and serializes edits', async () => {
  let resolveFirst!: () => void;
  const first = new Promise<void>(resolve => { resolveFirst = resolve; });
  const writes: string[] = []; const statuses: SaveStatus[] = [];
  const saver = new DraftSaver('', async code => { writes.push(code); if(code === 'old') await first; }, status => statuses.push(status));
  saver.update('old'); const pending = saver.flush();
  saver.update('new');
  assert.deepEqual(writes, ['old']);
  assert.ok(!statuses.includes('saved'));
  resolveFirst(); await pending;
  await saver.flush();
  assert.deepEqual(writes, ['old', 'new']);
  assert.equal(statuses.at(-1), 'saved');
});

test('failed writes retain the latest draft and can be retried', async () => {
  let fail = true; const statuses: SaveStatus[] = []; const writes: string[] = [];
  const saver = new DraftSaver('', async code => { if(fail) throw new Error('Offline'); writes.push(code); }, status => statuses.push(status));
  saver.update('my draft'); await saver.flush();
  assert.equal(statuses.at(-1), 'error');
  fail = false; await saver.flush();
  assert.deepEqual(writes, ['my draft']);
  assert.equal(statuses.at(-1), 'saved');
});
