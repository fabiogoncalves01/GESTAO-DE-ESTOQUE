
import React, { useState } from 'react';
import { Product } from '../types';

interface SalesProps {
  products: Product[];
  onAddTransaction: (transaction: {
    productId: string;
    type: 'OUT';
    quantity: number;
    customerName?: string;
    discountPercent?: number;
  }) => void;
}

const Sales: React.FC<SalesProps> = ({ products, onAddTransaction }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    onAddTransaction({
      productId: selectedProductId,
      type: 'OUT',
      quantity,
      customerName,
      discountPercent
    });

    setSelectedProductId('');
    setQuantity(1);
    setCustomerName('');
    setDiscountPercent(0);
  };

  const basePrice = selectedProduct?.price || 0;
  const discountAmount = basePrice * (discountPercent / 100);
  const finalUnitPrice = basePrice - discountAmount;
  const totalPrice = finalUnitPrice * quantity;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <i className="fas fa-cash-register text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Nova Venda</h2>
          <p className="text-slate-500">Faturamento e saída de mercadoria do estoque.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Selecionar Produto</label>
                <select
                  required
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none font-medium"
                >
                  <option value="">Clique para buscar no inventário...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} ({p.sku}) — {p.stock > 0 ? `Estoque: ${p.stock}` : 'ESGOTADO'} — R$ {p.price.toFixed(2)}
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
                    max={selectedProduct?.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Desconto (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-bold text-blue-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cliente / CPF (opcional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nome do cliente para o recibo"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedProductId || (selectedProduct && selectedProduct.stock < quantity)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Finalizar Venda
            </button>
          </form>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-between relative overflow-hidden h-fit sticky top-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-blue-400 opacity-80">Cupom de Venda</h3>
            <div className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Valor Unitário</span>
                <span className="font-mono">R$ {basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Quantidade</span>
                <span className="font-mono">x {quantity}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between items-center text-green-400">
                  <span className="text-sm italic">Desconto ({discountPercent}%)</span>
                  <span className="font-mono">- R$ {(discountAmount * quantity).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 pt-4 relative z-10">
            <p className="text-slate-400 text-[10px] mb-1 uppercase tracking-widest">Total a Pagar</p>
            <p className="text-4xl font-black text-white">
              <span className="text-blue-500 text-2xl mr-1">R$</span>
              {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
