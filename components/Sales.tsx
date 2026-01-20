
import React, { useState } from 'react';
import { Product } from '../types';

interface SalesProps {
  products: Product[];
  onAddTransaction: (transaction: {
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    customerName?: string;
  }) => void;
}

const Sales: React.FC<SalesProps> = ({ products, onAddTransaction }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    onAddTransaction({
      productId: selectedProductId,
      type,
      quantity,
      customerName: type === 'OUT' ? customerName : undefined
    });

    setSelectedProductId('');
    setQuantity(1);
    setCustomerName('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Faturamento & Movimentação</h2>
        <p className="text-slate-500">Registre vendas rápidas ou entradas de fornecedores.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('OUT')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium ${
                  type === 'OUT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <i className="fas fa-cart-shopping"></i>
                Venda
              </button>
              <button
                type="button"
                onClick={() => setType('IN')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium ${
                  type === 'IN' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <i className="fas fa-truck-loading"></i>
                Entrada
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Produto</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none"
                >
                  <option value="">Buscar produto no estoque...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Disp: {p.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quantidade</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                {type === 'OUT' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cliente (opcional)</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Identificar cliente"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                  </div>
                ) : (
                   <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Fornecedor / Origem</label>
                    <input
                      type="text"
                      placeholder="Ex: Fornecedor Central"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition opacity-50 cursor-not-allowed"
                      disabled
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedProductId || (type === 'OUT' && selectedProduct && selectedProduct.stock < quantity)}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
                type === 'OUT' 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-green-600 hover:bg-green-700 shadow-green-200'
              } disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed`}
            >
              {type === 'OUT' ? 'Emitir Faturamento' : 'Registrar Entrada'}
            </button>
            
            {type === 'OUT' && selectedProduct && selectedProduct.stock < quantity && (
              <p className="text-center text-red-500 text-sm font-medium animate-pulse">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                Estoque insuficiente.
              </p>
            )}
          </form>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-blue-400 opacity-80">Check-out</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Operação</span>
                <span className={`px-2 py-1 rounded text-[10px] font-black ${type === 'OUT' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                  {type === 'OUT' ? 'SAÍDA' : 'ENTRADA'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Preço Un.</span>
                <span className="font-mono">R$ {selectedProduct?.price.toFixed(2) || '0,00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Quantidade</span>
                <span className="font-mono">{quantity}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 relative z-10">
            <p className="text-slate-400 text-xs mb-2 uppercase tracking-widest">Total Geral</p>
            <p className="text-4xl font-black text-white">
              <span className="text-blue-500 text-2xl mr-1">R$</span>
              {((selectedProduct?.price || 0) * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
