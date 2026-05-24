import { createContext, useCallback, useContext, useState } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email }
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem('accessToken') ?? null
  );

  const saveToken = useCallback((token) => {
    sessionStorage.setItem('accessToken', token);
    setAccessToken(token);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login(email, password);
    saveToken(data.accessToken);
    setUser({ email });
    return data;
  }, [saveToken]);

  const register = useCallback(async (email, password) => {
    const { data } = await authApi.register(email, password);
    return data; // { id, email, createdAt } — does not auto-login
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      sessionStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const isAuthenticated = Boolean(accessToken);

  return (
    <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
