
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateStock: (id: string, amount: number) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateStock }) => {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', purchasePrice: 0, price: 0, stock: 0, category: '', minStock: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setShowModal(false);
    setNewProduct({ name: '', sku: '', purchasePrice: 0, price: 0, stock: 0, category: '', minStock: 5 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Mercadorias</h2>
          <p className="text-slate-500">Entrada de produtos com controle de margem.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          <i className="fas fa-plus"></i>
          Nova Mercadoria
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produto</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Custo Unit.</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Venda Unit.</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Margem (%)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estoque</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => {
                const margin = ((product.price - product.purchasePrice) / product.price * 100).toFixed(1);
                return (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{product.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono uppercase">{product.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">R$ {product.purchasePrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-black">
                        {margin}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${product.stock <= product.minStock ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                        <span className="font-mono font-bold text-slate-700">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onUpdateStock(product.id, 1)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                      >
                        <i className="fas fa-arrow-up-right-from-square"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">Nova Entrada de Estoque</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Nome do Produto</label>
                  <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-inner" placeholder="Ex: Camisa Social Slim"
                    value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Valor de Compra (Custo)</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-inner"
                    value={newProduct.purchasePrice} onChange={e => setNewProduct({...newProduct, purchasePrice: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Valor de Venda</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-inner font-bold text-blue-600"
                    value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">Qtd Inicial</label>
                  <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-inner"
                    value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2">SKU / ID</label>
                  <input required type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-inner"
                    value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                  Cadastrar Mercadoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
