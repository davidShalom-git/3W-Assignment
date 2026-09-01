const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const requireAuth = require('../middleware/auth');
const { uploadImage } = require('../config/cloudinary');
const { buildFeedQuery } = require('../utils/pagination');
const { toggleLike } = require('../utils/likeToggle');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// GET /api/posts?cursor=<postId>&limit=10 - public feed, newest first
// Also doubles as the profile-activity feed: ?authorId=, ?likedBy=, ?commentedBy=
// filter which posts come back, cursor pagination works the same either way.
router.get('/', async (req, res, next) => {
  try {
    const { filter, limit } = buildFeedQuery(req.query.cursor, req.query.limit);

    if (req.query.authorId) filter.authorId = req.query.authorId;
    if (req.query.likedBy) filter['likes.userId'] = req.query.likedBy;
    if (req.query.commentedBy) filter['comments.userId'] = req.query.commentedBy;

    const posts = await Post.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = posts.length > limit;
    const page = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? page[page.length - 1]._id : null;

    res.json({ posts: page, nextCursor });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();

    if (!text && !req.file) {
      return res.status(400).json({ message: 'Post needs text, an image, or both' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);
    }

    const post = await Post.create({
      authorId: req.user.id,
      authorUsername: req.user.username,
      text,
      imageUrl,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/like', requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { likes, liked } = toggleLike(post.likes, req.user.id, req.user.username);
    post.likes = likes;
    await post.save();

    res.json({ liked, likesCount: post.likes.length });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/share', requireAuth, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { shares: 1 } }, { new: true }).lean();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ sharesCount: post.shares });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/:id/comment',
  requireAuth,
  [body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Comment cannot be empty')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      post.comments.push({
        userId: req.user.id,
        username: req.user.username,
        text: req.body.text,
      });
      await post.save();

      res.status(201).json({ comments: post.comments });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
