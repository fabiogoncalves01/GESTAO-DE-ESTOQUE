
import React from 'react';
import { Product, Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions }) => {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  
  const salesToday = transactions
    .filter(t => t.type === 'OUT' && new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((acc, t) => acc + t.totalValue, 0);

  const chartData = products.slice(0, 5).map(p => ({
    name: p.name,
    stock: p.stock
  }));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500">Bem-vindo ao painel de controle da sua loja.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-sm font-medium text-slate-600">Sistema Operacional</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Estoque Total" 
          value={totalStock.toString()} 
          icon="fa-cubes" 
          color="blue" 
          trend="+2.5% vs mês anterior" 
        />
        <StatCard 
          label="Vendas Hoje" 
          value={`R$ ${salesToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="fa-receipt" 
          color="green" 
          trend="8 novos pedidos" 
        />
        <StatCard 
          label="Valor em Estoque" 
          value={`R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="fa-dollar-sign" 
          color="purple" 
          trend="34 SKUs ativos" 
        />
        <StatCard 
          label="Alertas de Estoque" 
          value={lowStockCount.toString()} 
          icon="fa-triangle-exclamation" 
          color={lowStockCount > 0 ? "orange" : "blue"} 
          trend={lowStockCount > 0 ? "Itens críticos" : "Tudo em ordem"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6">Níveis de Estoque (Top Itens)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stock < 15 ? '#f97316' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6">Últimas Movimentações</h3>
          <div className="space-y-4">
            {transactions.slice(0, 6).length > 0 ? (
              transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <i className={`fas ${t.type === 'IN' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.productName}</p>
                      <p className="text-xs text-slate-500">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-slate-800'}`}>
                      {t.type === 'IN' ? '+' : '-'}{t.quantity}
                    </p>
                    <p className="text-xs text-slate-400">R$ {t.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <i className="fas fa-inbox text-4xl mb-2 block"></i>
                <p>Nenhuma movimentação</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]} border`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        <p className="text-xs mt-1 text-slate-500">{trend}</p>
      </div>
    </div>
  );
};

export default Dashboard;
