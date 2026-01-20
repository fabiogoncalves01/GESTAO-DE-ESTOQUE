
import React, { useState, useEffect } from 'react';
import { Product, Transaction, View } from './types';
import { storageService } from './services/storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    setProducts(storageService.getProducts());
    setTransactions(storageService.getTransactions());
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    storageService.saveProducts(updatedProducts);
    notify("Produto cadastrado com sucesso!");
  };

  const handleAddTransaction = (txData: {
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    customerName?: string;
  }) => {
    const product = products.find(p => p.id === txData.productId);
    if (!product) return;

    if (txData.type === 'OUT' && product.stock < txData.quantity) {
      notify("Estoque insuficiente para a venda!", "error");
      return;
    }

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      productId: txData.productId,
      productName: product.name,
      type: txData.type,
      quantity: txData.quantity,
      date: new Date().toISOString(),
      totalValue: product.price * txData.quantity,
      customerName: txData.customerName
    };

    const updatedProducts = products.map(p => {
      if (p.id === txData.productId) {
        return {
          ...p,
          stock: txData.type === 'IN' ? p.stock + txData.quantity : p.stock - txData.quantity
        };
      }
      return p;
    });

    const updatedTransactions = [transaction, ...transactions];
    setProducts(updatedProducts);
    setTransactions(updatedTransactions);
    storageService.saveProducts(updatedProducts);
    storageService.saveTransactions(updatedTransactions);
    notify(txData.type === 'OUT' ? "Venda registrada!" : "Entrada registrada!");
  };

  const handleQuickUpdateStock = (id: string, amount: number) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    
    handleAddTransaction({
      productId: id,
      type: 'IN',
      quantity: amount
    });
  };

  const renderView = () => {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {(() => {
          switch (currentView) {
            case 'dashboard': return <Dashboard products={products} transactions={transactions} />;
            case 'inventory': return <Inventory products={products} onAddProduct={handleAddProduct} onUpdateStock={handleQuickUpdateStock} />;
            case 'sales': return <Sales products={products} onAddTransaction={handleAddTransaction} />;
            case 'reports': return <Reports transactions={transactions} />;
            default: return <Dashboard products={products} transactions={transactions} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-700">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Global Notification Toast */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-2xl shadow-2xl text-white font-medium flex items-center gap-3 animate-in slide-in-from-right-full duration-300 z-[100] ${notification.type === 'success' ? 'bg-slate-900' : 'bg-red-600'}`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle text-green-400' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default App;
