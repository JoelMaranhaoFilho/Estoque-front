// src/pages/Pesquisa.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/tela-login.png";
import logo    from "../../assets/logo-prefeitura.png";

const tiposMovimento = ["Entrada", "Saída"];
const tiposMaterial  = ["Cimento", "Areia", "Brita", "Bloco de Concreto"];

export default function Pesquisa() {
  const navigate = useNavigate();

  // estados dos filtros
  const [nome, setNome]                     = useState("");
  const [dataInicial, setDataInicial]       = useState("");
  const [dataFinal, setDataFinal]           = useState("");
  const [tipoMovimento, setTipoMovimento]   = useState("");
  const [tipoMaterial, setTipoMaterial]     = useState("");

  // limpa todos os filtros
  function handleLimpar() {
    setNome("");
    setDataInicial("");
    setDataFinal("");
    setTipoMovimento("");
    setTipoMaterial("");
  }

  // dispara a pesquisa (aqui só mock)
  function handlePesquisar(e: React.FormEvent) {
    e.preventDefault();
    console.log({
      nome,
      dataInicial,
      dataFinal,
      tipoMovimento,
      tipoMaterial,
    });
    alert("Pesquisa enviada! Veja o console para os filtros.");
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* overlay escuro */}
      <div className="absolute inset-0 bg-[#0B2847] bg-opacity-90" />

      <div className="relative z-10 px-4 pt-16 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo Prefeitura"
            className="mx-auto h-12 w-12 mb-2"
          />
          <h1 className="font-poppins text-4xl font-bold text-white">
            Secretaria de Saúde
          </h1>
          <p className="text-white/80 text-lg">
            Pesquisa de Materiais
          </p>
        </div>

        {/* Card de Filtros */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 space-y-6">
          <form onSubmit={handlePesquisar} className="space-y-6">
            {/* Nome do material */}
            <div className="flex flex-col">
              <label className="text-white mb-2">Nome do material</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do material"
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white placeholder-white/70 outline-none focus:border-white transition"
              />
            </div>

            {/* Período */}
            <div className="flex space-x-4">
              <div className="flex-1 flex flex-col">
                <label className="text-white mb-2">Data inicial</label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={e => setDataInicial(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white outline-none focus:border-white transition"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-white mb-2">Data final</label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={e => setDataFinal(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white outline-none focus:border-white transition"
                />
              </div>
            </div>

            {/* Tipo de Movimento */}
            <div className="flex flex-col">
              <label className="text-white mb-2">Tipo de Movimento</label>
              <select
                value={tipoMovimento}
                onChange={e => setTipoMovimento(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white outline-none focus:border-white transition"
              >
                <option value="" disabled>Tipo de movimento</option>
                {tiposMovimento.map(tm => (
                  <option key={tm} value={tm}>{tm}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Material */}
            <div className="flex flex-col">
              <label className="text-white mb-2">Tipo de Material</label>
              <select
                value={tipoMaterial}
                onChange={e => setTipoMaterial(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white outline-none focus:border-white transition"
              >
                <option value="" disabled>Tipo de material</option>
                {tiposMaterial.map(tm => (
                  <option key={tm} value={tm}>{tm}</option>
                ))}
              </select>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-[#0B2847] hover:bg-[#0d3259] text-white py-3 rounded-lg font-medium transition"
              >
                Pesquisar
              </button>
              <button
                type="button"
                onClick={handleLimpar}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition"
              >
                Limpar Filtros
              </button>
            </div>
          </form>
        </div>

        {/* Botão Voltar */}
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
