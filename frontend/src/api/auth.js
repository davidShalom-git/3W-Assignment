import client from './client';

export function signup({ username, email, password }) {
  return client.post('/api/auth/signup', { username, email, password }).then((res) => res.data);
}

export function login({ email, password }) {
  return client.post('/api/auth/login', { email, password }).then((res) => res.data);
}
