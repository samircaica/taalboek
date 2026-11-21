import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, seekSeconds } from '../src/storage.js';

test('tokenize preserves punctuation in European languages',()=>{
  assert.deepEqual(tokenize('Alice  was\nvery tired.'),['Alice','was','very','tired.']);
});
test('seek clamps at beginning and end',()=>{
  assert.equal(seekSeconds(12,-30,90),0);
  assert.equal(seekSeconds(85,30,90),90);
  assert.equal(seekSeconds(50,-30,90),20);
});
test('empty text has zero tokens',()=>{
  assert.deepEqual(tokenize(''),[]);
});
