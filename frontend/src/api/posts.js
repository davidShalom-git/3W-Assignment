import client from './client';

export function getFeed(cursor) {
  const params = cursor ? { cursor, limit: 10 } : { limit: 10 };
  return client.get('/api/posts', { params }).then((res) => res.data);
}

// Same feed endpoint, filtered - powers the profile activity tabs
// (my posts / liked / commented) with the same cursor pagination.
export function getPostsBy(filterParams, cursor) {
  const params = { ...filterParams, limit: 10 };
  if (cursor) params.cursor = cursor;
  return client.get('/api/posts', { params }).then((res) => res.data);
}

export function getPost(postId) {
  return client.get(`/api/posts/${postId}`).then((res) => res.data.post);
}

export function createPost({ text, imageFile }) {
  const formData = new FormData();
  if (text) formData.append('text', text);
  if (imageFile) formData.append('image', imageFile);

  return client
    .post('/api/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data.post);
}

export function toggleLike(postId) {
  return client.post(`/api/posts/${postId}/like`).then((res) => res.data);
}

export function addComment(postId, text) {
  return client.post(`/api/posts/${postId}/comment`, { text }).then((res) => res.data.comments);
}

export function sharePost(postId) {
  return client.post(`/api/posts/${postId}/share`).then((res) => res.data);
}
