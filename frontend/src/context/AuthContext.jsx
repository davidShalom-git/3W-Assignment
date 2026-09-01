import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user'));
      if (saved?.username) return saved;
    } catch {
      // fall through to clear stale storage below
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  });

  function persist(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  async function signup(data) {
    const { token, user } = await authApi.signup(data);
    persist(token, user);
  }

  async function login(data) {
    const { token, user } = await authApi.login(data);
    persist(token, user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
