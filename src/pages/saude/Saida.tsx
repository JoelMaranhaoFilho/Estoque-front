// src/pages/Saida.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/tela-login.png";

export default function Saida() {
  const navigate = useNavigate();

  // Estados do formulário
  const [material, setMaterial] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [destino, setDestino] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");

  function handleCancelar() {
    setMaterial("");
    setQuantidade("");
    setSolicitante("");
    setDestino("");
    setResponsavel("");
    setObservacoes("");
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      material,
      quantity: Number(quantidade),
      requester: solicitante,
      destination: destino,
      responsible: responsavel,
      note: observacoes,
    };

    try {
      const res = await fetch("http://localhost:3000/material-exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMsg = "Erro ao registrar a saída";
        try {
          const errBody = await res.json();
          errorMsg = errBody.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      alert("Saída de material registrada com sucesso!");
      handleCancelar();
    } catch (err: any) {
      alert(err.message || "Erro ao registrar a saída");
      console.error(err);
    }
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0B2847] bg-opacity-90" />
      <div className="relative z-10 px-4 pt-16 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-poppins text-4xl font-bold text-white">Secretaria de Saúde</h1>
          <p className="text-white/80 text-lg">Saída de Materiais</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Saída de Material</h2>
          <form onSubmit={handleSalvar} className="space-y-6">
            <div className="flex flex-col">
              <label className="text-white mb-2">Material</label>
              <input
                type="text"
                placeholder="Material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-2">Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-2">Solicitante</label>
              <input
                type="text"
                value={solicitante}
                onChange={(e) => setSolicitante(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-2">Destino</label>
              <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-2">Responsável</label>
              <input
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white mb-2">Observações</label>
              <textarea
                rows={3}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white resize-none"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancelar}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#0B2847] hover:bg-[#0d3259] text-white py-3 rounded-lg font-medium"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-4 rounded-lg text-lg font-medium transition"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
