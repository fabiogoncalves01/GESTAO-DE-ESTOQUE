
import React from 'react';
import { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const totalSales = transactions
    .filter(t => t.type === 'OUT')
    .reduce((acc, t) => acc + t.totalValue, 0);

  const totalInputs = transactions
    .filter(t => t.type === 'IN')
    .reduce((acc, t) => acc + t.totalValue, 0);

  const profit = totalSales - totalInputs;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Relatórios Financeiros</h2>
        <p className="text-slate-500">Análise de desempenho e fluxo de caixa.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Total de Vendas</p>
          <p className="text-2xl font-bold text-green-600">R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Custo de Reposição</p>
          <p className="text-2xl font-bold text-red-600">R$ {totalInputs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Saldo em Caixa (Bruto)</p>
          <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-slate-700">Histórico Detalhado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Qtd</th>
                <th className="px-6 py-4 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{t.productName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${t.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {t.type === 'IN' ? 'ENTRADA' : 'SAÍDA'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{t.quantity}</td>
                  <td className="px-6 py-4 text-right font-semibold">R$ {t.totalValue.toFixed(2)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Nenhum dado para exibir.</td>
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
