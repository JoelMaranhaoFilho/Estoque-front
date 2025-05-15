// src/pages/Saude.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import bgImage from '../../assets/tela-login.png';

const COLORS = ['#4B9CD3', '#6EB5E7', '#2A74B3'];

interface Movimentacao {
  timestamp: string;
  tipo: string;
  documento?: string;
  material: string;
  quantidade: number;
  unidade: string;
  unitPrice?: number;
  totalPrice?: number;
  saldoPos?: number;
  solicitante?: string;
  responsavel?: string;
  obs: string;
}

interface BarData {
  periodo: string;
  qtd: number;
}

interface PieData {
  name: string;
  value: number;
}

export default function Saude() {
  const navigate = useNavigate();
  const tabs = ['Entrada', 'Saída', 'Pesquisar', 'Gerar Relatórios'];
  const [activeTab, setActiveTab] = useState('Entrada');

  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [dataBar, setDataBar] = useState<BarData[]>([]);
  const [dataPie, setDataPie] = useState<PieData[]>([]);
  const [entradaTotal, setEntradaTotal] = useState(0);
  const [saidaTotal, setSaidaTotal] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/dashboard/saude')
      .then(res => res.json())
      .then(data => {
        setMovimentacoes(data.movimentacoes);
        setDataBar(
          Object.entries(data.porMes).map(([periodo, qtd]) => ({ periodo, qtd: Number(qtd) }))
        );
        setDataPie(
          Object.entries(data.porTipo).map(([name, value]) => ({ name, value: Number(value) }))
        );
        setEntradaTotal(data.entrada);
        setSaidaTotal(data.saida);
      });
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0B2847] bg-opacity-90" />

      <div className="relative z-10 px-4 pt-16 max-w-6xl mx-auto flex flex-col items-center">
        <h1 className="font-poppins text-4xl font-bold text-white mb-2">
          Secretaria de Saúde
        </h1>
        <p className="text-white/80 text-lg mb-8">
          Controle de Materiais de Construção
        </p>

        <nav className="w-full mb-8">
          <ul className="flex justify-center space-x-4">
            {tabs.map(tab => (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    switch(tab) {
                      case 'Entrada':
                        navigate('/saude/entrada');
                        break;
                      case 'Saída':
                        navigate('/saude/saida');
                        break;
                      case 'Pesquisar':
                        navigate('/saude/pesquisa');
                        break;
                      case 'Gerar Relatórios':
                        navigate('/saude/relatorios');
                        break;
                      default:
                        navigate('/saude');
                    }
                  }}
                  className={`text-sm font-medium transition px-4 py-2 rounded-full ${
                    activeTab === tab
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="w-full overflow-x-auto bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Movimentações Recentes</h2>
          <table className="min-w-full text-white table-auto">
            <thead>
              <tr className="border-b border-white/30">
                <th className="px-2 py-1">Data/Hora</th>
                <th className="px-2 py-1">Tipo</th>
                <th className="px-2 py-1">Documento</th>
                <th className="px-2 py-1">Material</th>
                <th className="px-2 py-1">Qtde</th>
                <th className="px-2 py-1">Uni</th>
                <th className="px-2 py-1">Vl. Unit.</th>
                <th className="px-2 py-1">Vl. Total</th>
                <th className="px-2 py-1">Saldo Pós</th>
                <th className="px-2 py-1">Solicitante</th>
                <th className="px-2 py-1">Responsável</th>
                <th className="px-2 py-1">Observações</th>
              </tr>
            </thead>
            <tbody className="opacity-90">
              {movimentacoes.slice(0, 6).map((m, i) => (
                <tr key={i} className="border-b border-white/20">
                  <td className="px-2 py-1 whitespace-nowrap">
                    {new Date(m.timestamp).toLocaleString()}
                  </td>
                  <td className="px-2 py-1">{m.tipo}</td>
                  <td className="px-2 py-1">{m.documento || '-'}</td>
                  <td className="px-2 py-1">{m.material}</td>
                  <td className="px-2 py-1">{m.quantidade}</td>
                  <td className="px-2 py-1">{m.unidade}</td>
                  <td className="px-2 py-1">
                    {m.unitPrice
                      ? m.unitPrice.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      : '-'}
                  </td>
                  <td className="px-2 py-1">
                    {m.totalPrice
                      ? m.totalPrice.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                      : '-'}
                  </td>
                  <td className="px-2 py-1">{m.saldoPos}</td>
                  <td className="px-2 py-1">{m.solicitante || '-'}</td>
                  <td className="px-2 py-1">{m.responsavel || '-'}</td>
                  <td className="px-2 py-1 max-w-xs truncate" title={m.obs}>{m.obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráficos e totais */}
        <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
          {/* Bar Chart */}
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Movimentação por Tipo (Quantitativo)
            </h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={dataBar}>
                  <XAxis dataKey="periodo" tick={{ fill: '#fff', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                  <ReTooltip
                    contentStyle={{ backgroundColor: '#0B2847', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="qtd" fill={COLORS[0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Distribuição de Movimentações
            </h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dataPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {dataPie.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{ backgroundColor: '#0B2847', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Linha de Saldo Acumulado por Mês */}
        <div className="w-full bg-white/20 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Saldo Acumulado por Mês
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={dataBar.map((d, i) => ({ periodo: d.periodo, saldo: dataBar.slice(0, i + 1).reduce((sum, x) => sum + x.qtd, 0) }))}>
                <XAxis dataKey="periodo" tick={{ fill: '#fff', fontSize: 12 }} />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                <ReTooltip
                  contentStyle={{ backgroundColor: '#0B2847', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="saldo" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Totais */}
        <div className="w-full flex flex-col md:flex-row gap-6 items-center mb-8">
          <div className="flex-1 text-center">
            <p className="text-white/70">Total de Itens Entrada</p>
            <p className="text-2xl font-bold text-white mt-2">
              {entradaTotal.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-white/70">Total de Itens Saída</p>
            <p className="text-2xl font-bold text-white mt-2">
              {saidaTotal.toLocaleString('pt-BR')}
            </p>
          </div>
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