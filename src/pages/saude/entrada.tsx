// src/pages/Entrada.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/tela-login.png';

export default function Entrada() {
  const navigate = useNavigate();

  // Controle de visibilidade
  const [useInvoice, setUseInvoice] = useState(true);
  const [useManual, setUseManual] = useState(false);

  // Estados Nota Fiscal
  const [material, setMaterial] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [invoicePreview, setInvoicePreview] = useState<any>(null);

  // Estados Item Manual
  const [entryMaterial, setEntryMaterial] = useState('');
  const [entryQuantity, setEntryQuantity] = useState('');
  const [entryUnit, setEntryUnit] = useState('un');
  const [entryUnitPrice, setEntryUnitPrice] = useState('');
  const [entryObservation, setEntryObservation] = useState('');

  // Auto-import PDF
  useEffect(() => {
    if (pdfFile) importPdf();
  }, [pdfFile]);

  async function importPdf() {
    if (!pdfFile) return;
    const formData = new FormData();
    formData.append('file', pdfFile);
    try {
      const res = await fetch('http://localhost:3000/pdf-invoices/import', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Falha ao importar PDF');
      const data = await res.json();
      preencherCampos(data);
      setInvoicePreview(data);
    } catch {
      alert('Erro ao importar PDF');
    }
  }

  async function importXml() {
    if (!xmlFile) return;
    const xmlText = await xmlFile.text();
    try {
      const res = await fetch('http://localhost:3000/invoices/import-from-xml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xml: xmlText }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      preencherCampos(data);
      setInvoicePreview(data);
    } catch {
      alert('Erro ao importar XML');
    }
  }

  async function importQrCode() {
    if (!qrCodeUrl) return;
    try {
      const res = await fetch('http://localhost:3000/invoices/import-from-qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: qrCodeUrl }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      preencherCampos(data);
      setInvoicePreview(data);
    } catch {
      alert('Erro ao importar QR Code');
    }
  }

  function preencherCampos(data: any) {
    setMaterial(data.supplierName || '');
    setIssueDate(data.issueDate?.slice(0, 10) || '');
    setTotalValue(data.totalValue?.toString() || '');
    setObservacoes(data.supplierAddress || '');
  }

  function limparFormulario() {
    // NF
    setMaterial('');
    setIssueDate('');
    setTotalValue('');
    setObservacoes('');
    setPdfFile(null);
    setXmlFile(null);
    setQrCodeUrl('');
    setInvoicePreview(null);
    // Manual
    setEntryMaterial('');
    setEntryQuantity('');
    setEntryUnit('un');
    setEntryUnitPrice('');
    setEntryObservation('');
    document.querySelectorAll<HTMLInputElement>('input[type="file"]').forEach(i => i.value = '');
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (useInvoice === useManual) {
      alert('Selecione exatamente uma opção: Nota Fiscal ou Item Manual.');
      return;
    }

    // Nota Fiscal
    if (useInvoice) {
  if (!invoicePreview) {
    alert('Importe a nota fiscal antes de salvar.');
    return;
  }
  // Envia para o backend
  try {
    const payload = {
      supplierName: invoicePreview.supplierName,
      supplierCnpj: invoicePreview.supplierCnpj,
      supplierAddress: invoicePreview.supplierAddress,
      issueDate: invoicePreview.issueDate,
      totalValue: Number(invoicePreview.totalValue),
      items: invoicePreview.items.map((it: any) => ({
        name: it.name,
        quantity: Number(it.quantity),
        unit: it.unit || 'un',
        unitPrice: Number(it.unitPrice),
        totalPrice: Number(it.totalPrice),
      })),
    };
    const res = await fetch('http://localhost:3000/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Falha ao salvar NF');
    alert('Nota fiscal salva com sucesso!');
    limparFormulario();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar nota fiscal');
  }
  return;
}

    // Item Manual
    if (useManual) {
      if (!entryMaterial || !entryQuantity || !entryUnitPrice) {
        alert('Preencha todos os campos do item manual.');
        return;
      }
      const payload = {
        material: entryMaterial,
        quantity: Number(entryQuantity),
        unit: entryUnit,
        unitPrice: Number(entryUnitPrice),
        note: entryObservation,
        origin: material,
      };
      try {
        const res = await fetch('http://localhost:3000/material-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || res.statusText);
        }
        alert('Item manual salvo com sucesso!');
        limparFormulario();
      } catch (err: any) {
        alert(`Erro ao salvar item manual: ${err.message}`);
      }
      return;
    }
  }
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-[#0B2847]/90" />
      <div className="relative z-10 px-4 pt-16 max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-4">Secretaria de Saúde</h1>
        <form onSubmit={handleSalvar} className="space-y-6 bg-white/10 p-6 rounded-2xl backdrop-blur-sm">

          {/* Toggle */}
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 text-white">
              <input type="checkbox" checked={useInvoice} onChange={() => setUseInvoice(v => !v)} className="form-checkbox" />
              <span>Usar Nota Fiscal</span>
            </label>
            <label className="flex items-center space-x-2 text-white">
              <input type="checkbox" checked={useManual} onChange={() => setUseManual(v => !v)} className="form-checkbox" />
              <span>Usar Item Manual</span>
            </label>
          </div>

          {/* Preview NF */}
          {useInvoice && invoicePreview && (
            <div className="bg-white/20 p-4 rounded-lg">
              <h2 className="text-white font-semibold mb-2">Preview Nota Fiscal</h2>
              <p className="text-white text-sm">Fornecedor: {invoicePreview.supplierName}</p>
              <p className="text-white text-sm">Data: {invoicePreview.issueDate.slice(0,10)}</p>
              <p className="text-white text-sm">Total: R$ {invoicePreview.totalValue}</p>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full text-white text-sm">
                  <thead>
                    <tr>
                      <th className="p-1 border-b border-white/30">Material</th>
                      <th className="p-1 border-b border-white/30">Qtd</th>
                      <th className="p-1 border-b border-white/30">Preço U.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicePreview.items?.map((it: any, i: number) => (
                      <tr key={i}>
                        <td className="p-1">{it.name}</td>
                        <td className="p-1">{it.quantity}</td>
                        <td className="p-1">{it.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Campos NF */}
          {useInvoice && (
            <fieldset className="space-y-4 border border-white/30 p-4 rounded-lg">
              <legend className="text-white font-semibold">Dados da Nota Fiscal</legend>
              <div className="space-y-2">
                <label className="block text-white">Fornecedor</label>
                <input type="text" value={material} onChange={e => setMaterial(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-white">Data de Emissão</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-white">Valor Total NF</label>
                  <input type="text" value={totalValue} onChange={e => setTotalValue(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
                </div>
                <div className="space-y-2">
                  <label className="block text-white">Observações</label>
                  <input type="text" value={observacoes} onChange={e => setObservacoes(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
                </div>
              </div>
              <div className="space-y-2"> 
                <label className="block text-white">Selecionar PDF</label>
                <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files?.[0]||null)} className="text-white" />
              </div>
              <div className="space-y-2"> 
                <label className="block text-white">Selecionar XML</label>
                <input type="file" accept=".xml" onChange={e => setXmlFile(e.target.files?.[0]||null)} className="text-white" />
              </div>
              <div className="space-y-2"> 
                <label className="block text-white">URL do QR Code</label>
                <input type="text" placeholder="URL do QR Code" value={qrCodeUrl} onChange={e => setQrCodeUrl(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
              </div>
            </fieldset>
          )}

          {/* Campos Manuais */}
          {useManual && (
            <fieldset className="space-y-4 border border-white/30 p-4 rounded-lg">
              <legend className="text-white font-semibold">Item Manual</legend>
              <div className="space-y-2">
                <label className="block text-white">Material</label>
                <input type="text" placeholder="Material" value={entryMaterial} onChange={e => setEntryMaterial(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input type="number" placeholder="Quantidade" value={entryQuantity} onChange={e => setEntryQuantity(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
                <input type="text" placeholder="Unidade (m³, kg)" value={entryUnit} onChange={e => setEntryUnit(e.target.value)} className="w-full px-4 py-2 bg-transparent border border-white/30 rounded-lg text-white focus:border-white" />
                <input type="number" step="0.01" placeholder="Preço Unitário" value={entryUnitPrice} onChange={e => setEntryUnitPrice(e.target.value)} className="w-full px-4 py-2 bg-transparent	border border-white/30 rounded-lg text-white focus:border-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-white">Observação</label>
                <input type="text" placeholder="Observação" value={entryObservation} onChange={e => setEntryObservation(e.target.value)} className="w-full px-4 py-2 bg-transparent	border border-white/30 rounded-lg text-white focus:border-white" />
              </div>
            </fieldset>
          )}

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={limparFormulario} className="flex-1 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30">Cancelar</button>
            <button type="submit" className="flex-1 py-3 bg-[#0B2847] text-white rounded-lg hover:bg-[#0d3259]">Salvar</button>
          </div>
        </form>
        <button onClick={() => navigate(-1)} className="w-full py-4 mt-4 bg-white/20 text-white rounded-lg hover:bg-white/30">← Voltar</button>
      </div>
    </div>
  );
}
