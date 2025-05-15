// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/login';
import Menu from './pages/menu';
import Construcoes from './pages/construcoes';
import Saude from './pages/saude';
import Entrada from './pages/saude/entrada';
import Saida from './pages/saude/Saida';
import Pesquisa from './pages/saude/Pesquisa';
import Relatorios from './pages/saude/Relatorios';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route
            path="/construcoes"
            element={
              <PrivateRoute>
                <Construcoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/saude"
            element={
              <PrivateRoute>
                <Saude />
              </PrivateRoute>
            }
          />
          <Route
            path="/saude/entrada"
            element={
              <PrivateRoute>
                <Entrada />
              </PrivateRoute>
            }
          />
          <Route
            path="/saude/saida"
            element={
              <PrivateRoute>
                <Saida />
              </PrivateRoute>
            }
          />
          <Route
            path="/saude/pesquisa"
            element={
              <PrivateRoute>
                <Pesquisa />
              </PrivateRoute>
            }
          />
          <Route
            path="/saude/relatorios"
            element={
              <PrivateRoute>
                <Relatorios />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
