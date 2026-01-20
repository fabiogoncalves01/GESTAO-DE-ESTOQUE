
import React from 'react';
import { Product, Transaction } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

const Dashboard: React.FC<DashboardProps> = ({ products, transactions }) => {
  const today = new Date().toDateString();
  const transactionsToday = transactions.filter(t => new Date(t.date).toDateString() === today);
  
  const salesToday = transactionsToday
    .filter(t => t.type === 'OUT')
    .reduce((acc, t) => acc + t.totalValue, 0);

  const profitToday = transactionsToday
    .filter(t => t.type === 'OUT')
    .reduce((acc, t) => acc + (t.profit || 0), 0);

  const totalValueStock = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  // Dados para o gráfico de margem (Barras)
  const barChartData = products.slice(0, 5).map(p => ({
    name: p.name,
    margem: ((p.price - p.purchasePrice) / p.price * 100).toFixed(0)
  }));

  // Dados para o gráfico de categorias (Rosca)
  const categoryDataMap = products.reduce((acc: any, p) => {
    const cat = p.category || 'Sem Categoria';
    acc[cat] = (acc[cat] || 0) + p.stock;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryDataMap).map(key => ({
    name: key,
    value: categoryDataMap[key]
  }));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resumo do Dia</h2>
          <p className="text-slate-500">Acompanhamento de vendas e lucratividade.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Vendas Hoje" 
          value={`R$ ${salesToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="fa-shopping-cart" 
          color="blue" 
          trend={`${transactionsToday.filter(t => t.type === 'OUT').length} vendas realizadas`} 
        />
        <StatCard 
          label="Lucro Líquido" 
          value={`R$ ${profitToday.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="fa-chart-line" 
          color="green" 
          trend={`Margem média: ${salesToday > 0 ? ((profitToday / salesToday) * 100).toFixed(1) : 0}%`} 
        />
        <StatCard 
          label="Valor em Estoque" 
          value={`R$ ${totalValueStock.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon="fa-boxes-stacked" 
          color="purple" 
          trend={`${products.length} itens cadastrados`} 
        />
        <StatCard 
          label="Alertas Críticos" 
          value={lowStockCount.toString()} 
          icon="fa-triangle-exclamation" 
          color={lowStockCount > 0 ? "orange" : "blue"} 
          trend={lowStockCount > 0 ? "Reposição necessária" : "Estoque saudável"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Barras - Margem */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <i className="fas fa-percent text-blue-500"></i>
            Margem de Lucro por Produto (%)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="margem" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Rosca - Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-pie text-purple-500"></i>
            Estoque por Categoria
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimas Vendas - Ocupa a largura total em mobile, e se ajusta em desktop */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <i className="fas fa-clock-rotate-left text-orange-500"></i>
            Últimas Movimentações de Saída
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transactions.filter(t => t.type === 'OUT').slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="fas fa-bag-shopping"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{t.productName}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">{new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">R$ {t.totalValue.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-green-600">Lucro: +R$ {t.profit.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {transactions.filter(t => t.type === 'OUT').length === 0 && (
              <div className="col-span-full py-8 text-center text-slate-400 italic">
                Nenhuma venda registrada hoje.
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors[color]} border`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
      <p className="text-[11px] mt-2 text-slate-500 font-semibold">{trend}</p>
    </div>
  );
};

export default Dashboard;
