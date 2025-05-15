// src/pages/Construcoes.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import bgImage from "../../assets/tela-login.png";
import logo from "../../assets/logo-prefeitura.png";

const tabs = [
  "Saúde",
  "Educação",
  "Serviços Urbanos",
  "Assistência Social",
  "Esportes",
  "Cultura",
  "Agricultura",
];

const dataTabela = [
  { material: "Cimento", quantidade: 150 },
  { material: "Tijolo", quantidade: 2300 },
  { material: "Areia", quantidade: 750 },
  { material: "Bloco de Concreto", quantidade: 1200 },
];

const dataGrafico = dataTabela.map((d) => ({
  name: d.material,
  qty: d.quantidade,
}));

export default function Construcoes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("Saúde");

  function handleTabClick(tab: string) {
    // atualiza a tab ativa
    setActiveTab(tab);

    // só Saúde é permitida
    if (tab === "Saúde") {
      navigate("/saude");
    } else {
      alert('Você só tem permissão para acessar a aba da Secratária de Saúde "Saúde".');
    }
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-[#0B2847] bg-opacity-90" />

      {/* Conteúdo */}
      <div className="relative z-10 px-4 pt-16">
        {/* Header */}
        <div className="max-w-lg mx-auto flex flex-col items-center mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={logo}
              alt="Logo Prefeitura"
              className="h-10 w-10 flex-shrink-0"
            />
            <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-white uppercase leading-tight">
              Construções
            </h1>
          </div>
          <p className="text-white/80 text-sm text-center">
            Prefeitura Municipal de Camutanga
          </p>
        </div>

        {/* Tabs */}
        <nav className="w-full mb-8">
          <div className="flex justify-center flex-wrap gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`
                  px-4 py-2
                  text-white
                  text-sm
                  rounded-full
                  transition
                  focus:outline-none
                  cursor-pointer
                  ${
                    activeTab === tab
                      ? "bg-white/20 border-b-2 border-white font-semibold"
                      : "bg-transparent hover:bg-white/10 opacity-80"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {/* Card: Tabela */}
        <div className="max-w-lg mx-auto w-full bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Materiais Registrados
          </h2>
          <table className="w-full text-left text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="pb-2">Material</th>
                <th className="pb-2 text-right">Quantidade</th>
              </tr>
            </thead>
            <tbody className="opacity-90">
              {dataTabela.map(({ material, quantidade }) => (
                <tr key={material} className="border-b border-white/20">
                  <td className="py-2">{material}</td>
                  <td className="py-2 text-right">
                    {quantidade.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card: Gráfico */}
        <div className="max-w-lg mx-auto w-full bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Resumo de Movimentações
          </h2>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={dataGrafico}>
                <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 12 }} />
                <YAxis tick={{ fill: "#fff", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0B2847", border: "none" }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="qty"
                  stroke="#fff"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#0B2847", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="max-w-lg mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-4 rounded-lg text-lg font-medium transition"
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
