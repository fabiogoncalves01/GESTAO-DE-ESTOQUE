
import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txDate = new Date(t.date).toISOString().split('T')[0];
      const afterStart = !startDate || txDate >= startDate;
      const beforeEnd = !endDate || txDate <= endDate;
      return afterStart && beforeEnd;
    });
  }, [transactions, startDate, endDate]);

  const totalSales = filteredTransactions
    .filter(t => t.type === 'OUT')
    .reduce((acc, t) => acc + t.totalValue, 0);

  const totalInputs = filteredTransactions
    .filter(t => t.type === 'IN')
    .reduce((acc, t) => acc + t.totalValue, 0);

  const totalProfit = filteredTransactions
    .filter(t => t.type === 'OUT')
    .reduce((acc, t) => acc + (t.profit || 0), 0);

  const setQuickRange = (range: 'today' | 'week' | 'month') => {
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    let start = new Date();

    if (range === 'today') {
      start = now;
    } else if (range === 'week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      start = new Date(now.setDate(diff));
    } else if (range === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios Financeiros</h2>
          <p className="text-slate-500">Análise de desempenho e fluxo de caixa.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setQuickRange('today')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Hoje
          </button>
          <button 
            onClick={() => setQuickRange('week')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Semana
          </button>
          <button 
            onClick={() => setQuickRange('month')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Mês
          </button>
          <button 
            onClick={() => { setStartDate(''); setEndDate(''); }}
            className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200 transition"
          >
            Limpar
          </button>
        </div>
      </header>

      {/* Filtros de Data */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Início</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data Fim</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fas fa-arrow-up text-4xl text-green-600"></i>
          </div>
          <p className="text-sm text-slate-500 mb-1 font-medium">Faturamento (Período)</p>
          <p className="text-2xl font-black text-slate-900">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fas fa-truck-loading text-4xl text-red-600"></i>
          </div>
          <p className="text-sm text-slate-500 mb-1 font-medium">Investimento em Estoque</p>
          <p className="text-2xl font-black text-slate-900">R$ {totalInputs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <i className="fas fa-coins text-4xl text-blue-400"></i>
          </div>
          <p className="text-sm text-slate-400 mb-1 font-medium">Lucro Líquido Real</p>
          <p className={`text-2xl font-black ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Baseado em vendas concluídas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Histórico de Transações</h3>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-500">
            {filteredTransactions.length} registros
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Operação</th>
                <th className="px-6 py-4">Qtd</th>
                <th className="px-6 py-4 text-right">Valor Unit.</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{t.productName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${
                      t.type === 'IN' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {t.type === 'IN' ? 'ENTRADA' : 'VENDA'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{t.quantity}</td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    R$ {(t.type === 'IN' ? t.purchaseValue : t.saleValue).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">
                    R$ {t.totalValue.toFixed(2)}
                    {t.type === 'OUT' && (
                      <span className="block text-[9px] text-green-600">Lucro: +{t.profit.toFixed(2)}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <i className="fas fa-folder-open text-4xl mb-2"></i>
                      <p className="text-sm italic">Nenhuma movimentação encontrada para este período.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
