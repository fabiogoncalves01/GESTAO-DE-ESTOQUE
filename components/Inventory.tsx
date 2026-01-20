
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
    name: '', sku: '', price: 0, stock: 0, category: '', minStock: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setShowModal(false);
    setNewProduct({ name: '', sku: '', price: 0, stock: 0, category: '', minStock: 5 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Estoque</h2>
          <p className="text-slate-500">Gerencie seus produtos e níveis de reposição.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Produto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Preço</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estoque</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{product.sku}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">R$ {product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.stock <= product.minStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      <span className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-slate-700'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onUpdateStock(product.id, 1)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="Entrada rápida"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                      <button 
                        className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md transition"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Cadastrar Novo Produto</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition" 
                    placeholder="Ex: Camiseta Polo Branca"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Código</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition" 
                    placeholder="XYZ-123"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition" 
                    placeholder="Ex: Vestuário"
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
                  <input 
                    required 
                    type="number" 
                    step="0.01"
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition" 
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estoque Inicial</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-blue-500 transition" 
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Salvar Produto
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
