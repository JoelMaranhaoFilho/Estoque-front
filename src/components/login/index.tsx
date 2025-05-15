// src/components/login/index.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import bgImage from '../../assets/tela-login.png';
import logo from '../../assets/logo-prefeitura.png';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).message || 'Falha no login');
      }

      const { access_token } = await res.json();
      signIn(access_token);
      navigate('/construcoes');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl w-[320px] text-white">
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo Prefeitura" className="h-25 w-25" />
          <h1 className="font-poppins text-2xl font-semibold leading-tight">
            Prefeitura<br /> Municipal de<br /> Camutanga
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="Usuário"
            className="w-full px-4 py-3 rounded-lg bg-black/30 placeholder-white/50 text-white outline-none"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-lg bg-black/30 placeholder-white/50 text-white outline-none"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#0B2847] text-white font-semibold text-lg hover:bg-[#0d3259] transition"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
