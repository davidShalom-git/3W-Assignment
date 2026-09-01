// Populates the DB with sample users/posts so the app doesn't look empty on
// first run. Safe to re-run - skips creating users that already exist, and
// only adds posts the first time (checked via the SEED_TAG below).
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const { hashPassword } = require('../utils/password');

const SEED_PASSWORD = 'password123';

const USERS = [
  { username: 'maya_art', email: 'maya@example.com' },
  { username: 'leo_codes', email: 'leo@example.com' },
  { username: 'sara_writes', email: 'sara@example.com' },
  { username: 'kabir_travels', email: 'kabir@example.com' },
  { username: 'zara_designs', email: 'zara@example.com' },
];

// [authorUsername, text, imageUrl or null, hoursAgo]
const POSTS = [
  ['maya_art', "Finally finished the mural I've been working on all week. My arms are dead but it was worth it.", 'https://picsum.photos/seed/mural42/800/600', 72],
  ['leo_codes', 'Spent the whole afternoon debugging a race condition that turned out to be a missing await. Classic.', null, 65],
  ['sara_writes', "Started a new book today, already 80 pages in. Can't remember the last time I couldn't put something down.", null, 50],
  ['kabir_travels', 'Landed in Lisbon a few hours ago. The weather here is unreal right now.', 'https://picsum.photos/seed/lisbon7/800/600', 40],
  ['zara_designs', 'Redesigned my portfolio site over the weekend. Feels good to finally update it after two years.', 'https://picsum.photos/seed/portfolio3/800/600', 30],
  ['maya_art', "Coffee shop playlist today is unreasonably good. Anyone know what's playing at Blue Bottle on 5th?", null, 22],
  ['leo_codes', 'PR review taking longer than the actual feature took to build. The eternal struggle.', null, 15],
  ['sara_writes', 'Rainy days are made for tea and unfinished drafts.', null, 9],
  ['kabir_travels', "Tried the local pastries here, not sure I'm going back to normal breakfast after this.", 'https://picsum.photos/seed/pastry19/800/600', 5],
  ['zara_designs', 'Small UI detail, but changing button transitions from 300ms to 150ms made everything feel so much snappier.', null, 1],
];

const COMMENTS = [
  ['leo_codes', "This is amazing! You've got real talent."],
  ['sara_writes', 'Where exactly is this?'],
  ['zara_designs', 'Been there, can confirm the pastries are unreal.'],
  ['maya_art', 'Following those PR review struggles closely, feel this one.'],
  ['kabir_travels', 'Which book? Adding it to my list.'],
  ['sara_writes', 'Needed to hear this today honestly.'],
  ['leo_codes', 'The little details like that make such a difference.'],
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const usersByUsername = {};
  for (const u of USERS) {
    let user = await User.findOne({ username: u.username });
    if (!user) {
      const passwordHash = await hashPassword(SEED_PASSWORD);
      user = await User.create({ username: u.username, email: u.email, passwordHash });
      console.log('created user', u.username);
    }
    usersByUsername[u.username] = user;
  }

  const existingSeedPosts = await Post.countDocuments({
    authorUsername: { $in: USERS.map((u) => u.username) },
  });
  if (existingSeedPosts > 0) {
    console.log('sample posts already exist, skipping post creation');
    await mongoose.disconnect();
    return;
  }

  const createdPosts = [];
  for (const [username, text, imageUrl, hoursAgo] of POSTS) {
    const author = usersByUsername[username];
    const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    const post = await Post.create({
      authorId: author._id,
      authorUsername: author.username,
      text,
      imageUrl: imageUrl || '',
      createdAt,
      updatedAt: createdAt,
      shares: Math.floor(Math.random() * 6),
    });
    createdPosts.push(post);
  }
  console.log('created', createdPosts.length, 'posts');

  // scatter likes: every user likes a handful of posts that aren't their own
  let likeCount = 0;
  for (const post of createdPosts) {
    for (const u of USERS) {
      if (u.username === post.authorUsername) continue;
      if (Math.random() < 0.5) {
        const liker = usersByUsername[u.username];
        post.likes.push({ userId: liker._id, username: liker.username });
        likeCount += 1;
      }
    }
    await post.save();
  }
  console.log('added', likeCount, 'likes');

  // sprinkle a handful of comments across posts
  let commentIndex = 0;
  for (const post of createdPosts) {
    if (Math.random() < 0.6 && commentIndex < COMMENTS.length) {
      const [username, text] = COMMENTS[commentIndex];
      if (username !== post.authorUsername) {
        const commenter = usersByUsername[username];
        post.comments.push({ userId: commenter._id, username: commenter.username, text });
        await post.save();
        commentIndex += 1;
      }
    }
  }
  console.log('added', commentIndex, 'comments');

  console.log(`\nDone. Sample accounts all use password: ${SEED_PASSWORD}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
