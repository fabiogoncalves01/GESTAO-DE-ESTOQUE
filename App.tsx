
import React, { useState, useEffect } from 'react';
import { Product, Transaction, View } from './types';
import { storageService } from './services/storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import StockIn from './components/StockIn';
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
    notify("Mercadoria cadastrada!");
  };

  const handleAddTransaction = (txData: {
    productId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    customerName?: string;
    newPurchasePrice?: number;
    newSalePrice?: number;
    discountPercent?: number;
  }) => {
    const product = products.find(p => p.id === txData.productId);
    if (!product) return;

    if (txData.type === 'OUT' && product.stock < txData.quantity) {
      notify("Estoque insuficiente!", "error");
      return;
    }

    const effectivePurchasePrice = txData.newPurchasePrice ?? product.purchasePrice;
    const baseSalePrice = txData.newSalePrice ?? product.price;
    
    // Aplica desconto se houver (apenas para OUT)
    const discountFactor = (txData.type === 'OUT' && txData.discountPercent) ? (1 - (txData.discountPercent / 100)) : 1;
    const effectiveSalePriceFinal = baseSalePrice * discountFactor;
    
    // O lucro é baseado no preço de venda FINAL menos o preço de custo
    const profitPerUnit = txData.type === 'OUT' ? (effectiveSalePriceFinal - effectivePurchasePrice) : 0;

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      productId: txData.productId,
      productName: product.name,
      type: txData.type,
      quantity: txData.quantity,
      date: new Date().toISOString(),
      purchaseValue: effectivePurchasePrice,
      saleValue: effectiveSalePriceFinal, 
      totalValue: (txData.type === 'OUT' ? effectiveSalePriceFinal : effectivePurchasePrice) * txData.quantity,
      profit: profitPerUnit * txData.quantity,
      customerName: txData.customerName
    };

    const updatedProducts = products.map(p => {
      if (p.id === txData.productId) {
        return {
          ...p,
          stock: txData.type === 'IN' ? p.stock + txData.quantity : p.stock - txData.quantity,
          // Se for entrada, atualiza permanentemente os preços de tabela
          purchasePrice: txData.type === 'IN' ? effectivePurchasePrice : p.purchasePrice,
          price: txData.type === 'IN' ? baseSalePrice : p.price 
        };
      }
      return p;
    });

    const updatedTransactions = [transaction, ...transactions];
    setProducts(updatedProducts);
    setTransactions(updatedTransactions);
    storageService.saveProducts(updatedProducts);
    storageService.saveTransactions(updatedTransactions);
    
    const message = txData.type === 'OUT' 
      ? (txData.discountPercent ? `Venda com ${txData.discountPercent}% de desconto!` : "Venda realizada!") 
      : "Reposição de estoque concluída!";
    notify(message);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-700 font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {(() => {
              switch (currentView) {
                case 'dashboard': return <Dashboard products={products} transactions={transactions} />;
                case 'inventory': return <Inventory products={products} onAddProduct={handleAddProduct} onUpdateStock={(id, amt) => handleAddTransaction({productId: id, type: 'IN', quantity: amt})} />;
                case 'sales': return <Sales products={products} onAddTransaction={(data) => handleAddTransaction({...data, type: 'OUT'})} />;
                case 'stock-in': return <StockIn products={products} onAddTransaction={(data) => handleAddTransaction({...data, type: 'IN'})} />;
                case 'reports': return <Reports transactions={transactions} />;
                default: return <Dashboard products={products} transactions={transactions} />;
              }
            })()}
          </div>
        </div>
      </main>

      {notification && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-3xl shadow-2xl text-white font-black flex items-center gap-3 animate-in slide-in-from-right-full duration-300 z-[100] ${notification.type === 'success' ? 'bg-slate-900' : 'bg-red-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-white/20 text-white'}`}>
            <i className={`fas ${notification.type === 'success' ? 'fa-check' : 'fa-exclamation'}`}></i>
          </div>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default App;
