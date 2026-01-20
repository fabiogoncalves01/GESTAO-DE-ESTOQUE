
import React, { useState } from 'react';
import { Product } from '../types';

interface StockInProps {
  products: Product[];
  onAddTransaction: (transaction: {
    productId: string;
    type: 'IN';
    quantity: number;
    newPurchasePrice: number;
    newSalePrice: number;
  }) => void;
}

const StockIn: React.FC<StockInProps> = ({ products, onAddTransaction }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [newPurchasePrice, setNewPurchasePrice] = useState(0);
  const [newSalePrice, setNewSalePrice] = useState(0);

  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find(p => p.id === id);
    if (prod) {
      setNewPurchasePrice(prod.purchasePrice);
      setNewSalePrice(prod.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    onAddTransaction({
      productId: selectedProductId,
      type: 'IN',
      quantity,
      newPurchasePrice,
      newSalePrice
    });

    setSelectedProductId('');
    setQuantity(1);
    setNewPurchasePrice(0);
    setNewSalePrice(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
          <i className="fas fa-truck-loading text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Entrada de Mercadoria</h2>
          <p className="text-slate-500">Reposição de estoque e atualização de preços de custo.</p>
        </div>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Produto Recebido</label>
              <select
                required
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition"
              >
                <option value="">Identifique o produto no catálogo...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — Atual: {p.stock} un.
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantidade Recebida</label>
              <input
                required
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Novo Preço de Compra (Custo)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={newPurchasePrice}
                  onChange={(e) => setNewPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 pl-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 p-4 bg-green-50 rounded-2xl border border-green-100">
              <label className="block text-sm font-bold text-green-800 mb-2">Preço Sugerido para Venda</label>
              <p className="text-xs text-green-600 mb-3 font-medium">Atualize aqui se o valor de mercado do produto mudou.</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 font-bold">R$</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={newSalePrice}
                  onChange={(e) => setNewSalePrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 pl-12 bg-white border border-green-200 rounded-xl outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 font-bold text-green-700 text-lg"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedProductId}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Confirmar Entrada e Atualizar Preços
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockIn;
