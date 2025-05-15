import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../services/api';

export default function Menu() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [erro, setErro] = useState<string>();

  useEffect(() => {
    fetchWithAuth('/menu')
      .then(setProdutos)
      .catch(err => setErro(err.message));
  }, []);

  if (erro) return <p className="text-red-500">{erro}</p>;
  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>
    </div>
  );
}
