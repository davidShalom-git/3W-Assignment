const mongoose = require('mongoose');

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Cursor pagination on _id instead of skip/limit: ObjectIds are naturally
// time-ordered, so "give me posts older than this one" is a single indexed
// range query no matter how deep you page - skip/limit gets slower the
// further in you go because Mongo still has to walk past every skipped doc.
function buildFeedQuery(cursor, rawLimit) {
  const limit = Math.min(Number(rawLimit) || DEFAULT_LIMIT, MAX_LIMIT);
  const filter = {};

  if (cursor && mongoose.isValidObjectId(cursor)) {
    filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  return { filter, limit };
}

module.exports = { buildFeedQuery, DEFAULT_LIMIT, MAX_LIMIT };
