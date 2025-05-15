// src/pages/Relatorios.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/tela-login.png";
import logo from "../../assets/logo-prefeitura.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// Corrige a tipagem do autoTable para jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportItem {
  name: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
}

interface ReportEntry {
  supplierName: string;
  issueDate: string;
  items: ReportItem[];
}

export default function Relatorios() {
  const navigate = useNavigate();
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [relatorio, setRelatorio] = useState<ReportEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleGerar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setRelatorio([]);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/invoices/report?start=${dataInicial}&end=${dataFinal}`
      );
      const data = await res.json();
      setRelatorio(data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar relatório.");
    } finally {
      setLoading(false);
    }
  }

  function handleLimpar() {
    setDataInicial("");
    setDataFinal("");
    setRelatorio([]);
    setErro("");
  }

  function exportarPDF() {
  
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Relatório - Secretaria de Saúde - Prefeitura Municipal de Camutanga", 14, 20);


    const tableData: any[] = [];
    relatorio.forEach((r) => {
      r.items.forEach((item) => {
        tableData.push([
          new Date(r.issueDate).toLocaleDateString(),
          r.supplierName,
          item.name,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ]);
      });
    });

    autoTable(doc, {
  startY: 30,
  head: [["Data", "Fornecedor", "Item", "Qtd", "Unit.", "Total"]],
  body: tableData,
});


    doc.save("relatorio.pdf");
  }

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[#0B2847] bg-opacity-90" />

      <div className="relative z-10 px-4 pt-16 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo Prefeitura"
            className="mx-auto h-12 w-12 mb-2"
          />
          <h1 className="font-poppins text-4xl font-bold text-white">
            Relatórios de Materiais
          </h1>
          <p className="text-white/80 text-lg">
            Prefeitura Municipal de Camutanga
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 space-y-6">
          <form onSubmit={handleGerar} className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label className="text-white mb-2">Data inicial</label>
                <input
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white outline-none focus:border-white transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white mb-2">Data final</label>
                <input
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white outline-none focus:border-white transition"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-[#0B2847] hover:bg-[#0d3259] text-white py-3 rounded-lg font-medium transition"
              >
                Gerar Relatório
              </button>
              <button
                type="button"
                onClick={handleLimpar}
                className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition"
              >
                Limpar
              </button>
            </div>
          </form>
        </div>

        {loading && <p className="text-white text-center">Carregando...</p>}
        {erro && <p className="text-red-400 text-center">{erro}</p>}

        {relatorio.length > 0 ? (
          <>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white overflow-x-auto">
              <table className="w-full text-sm table-auto border-collapse">
                <thead>
                  <tr className="text-left border-b border-white/30">
                    <th className="p-2">Data</th>
                    <th className="p-2">Fornecedor</th>
                    <th className="p-2">Item</th>
                    <th className="p-2 text-center">Qtd</th>
                    <th className="p-2 text-center">Unit.</th>
                    <th className="p-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {relatorio.map((r) =>
                    r.items.map((item, idx) => (
                      <tr
                        key={`${r.supplierName}-${idx}`}
                        className="border-b border-white/10"
                      >
                        <td className="p-2">
                          {new Date(r.issueDate).toLocaleDateString()}
                        </td>
                        <td className="p-2 whitespace-pre-wrap">
                          {r.supplierName}
                        </td>
                        <td className="p-2 whitespace-pre-wrap">{item.name}</td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-center">R$ {item.unitPrice}</td>
                        <td className="p-2 text-center">R$ {item.totalPrice}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button
              onClick={exportarPDF}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              Baixar como PDF
            </button>
          </>
        ) : (
          !loading && <p className="text-white text-center">Nenhum dado encontrado.</p>
        )}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-4 rounded-lg text-lg font-medium transition"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}
