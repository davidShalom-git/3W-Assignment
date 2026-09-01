const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/password');
const { buildFeedQuery } = require('../utils/pagination');
const { toggleLike } = require('../utils/likeToggle');

test('hashPassword + comparePassword round trip', async () => {
  const hash = await hashPassword('secret123');
  assert.notEqual(hash, 'secret123');
  assert.equal(await comparePassword('secret123', hash), true);
  assert.equal(await comparePassword('wrongpass', hash), false);
});

test('buildFeedQuery with no cursor returns empty filter', () => {
  const { filter, limit } = buildFeedQuery(undefined, undefined);
  assert.deepEqual(filter, {});
  assert.equal(limit, 10);
});

test('buildFeedQuery with a cursor filters on _id less than it', () => {
  const id = new mongoose.Types.ObjectId();
  const { filter } = buildFeedQuery(id.toString(), 5);
  assert.equal(filter._id.$lt.toString(), id.toString());
});

test('buildFeedQuery clamps limit to MAX_LIMIT', () => {
  const { limit } = buildFeedQuery(undefined, 999);
  assert.equal(limit, 50);
});

test('toggleLike adds a like when not already liked', () => {
  const userId = new mongoose.Types.ObjectId();
  const { likes, liked } = toggleLike([], userId, 'alice');
  assert.equal(liked, true);
  assert.equal(likes.length, 1);
});

test('toggleLike removes a like when already liked', () => {
  const userId = new mongoose.Types.ObjectId();
  const existing = [{ userId, username: 'alice' }];
  const { likes, liked } = toggleLike(existing, userId, 'alice');
  assert.equal(liked, false);
  assert.equal(likes.length, 0);
});
