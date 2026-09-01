// Pure function so the toggle logic can be unit tested without touching Mongo.
function toggleLike(likes, userId, username) {
  const alreadyLiked = likes.some((like) => like.userId.toString() === userId.toString());

  if (alreadyLiked) {
    return {
      likes: likes.filter((like) => like.userId.toString() !== userId.toString()),
      liked: false,
    };
  }

  return {
    likes: [...likes, { userId, username }],
    liked: true,
  };
}

module.exports = { toggleLike };
