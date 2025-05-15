// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import { fetchWithAuth } from '../services/api';

type User = {
  id: number;
  username: string;
  // adicione outros campos que quiser expor
};

type AuthContextData = {
  user: User | null;
  signIn: (token: string) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Ao montar: tenta carregar o usuário se tiver token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    // busca dados do "me"
    fetchWithAuth('/users/me')
      .then((data) => setUser(data))
      .catch(() => {
        // token inválido, limpa
        localStorage.removeItem('authToken');
        setUser(null);
      });
  }, []);

  function signIn(token: string) {
    localStorage.setItem('authToken', token);
    // carrega o usuário imediatamente
    fetchWithAuth('/users/me')
      .then((data) => setUser(data))
      .catch(() => {
        setUser(null);
      });
  }

  function signOut() {
    localStorage.removeItem('authToken');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
