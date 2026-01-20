
import { Product, Transaction } from '../types';

const PRODUCTS_KEY = 'gestaopro_products';
const TRANSACTIONS_KEY = 'gestaopro_transactions';

export const storageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', name: 'Camiseta Algodão', sku: 'CAM-001', purchasePrice: 25.00, price: 59.90, stock: 45, category: 'Roupas', minStock: 10 },
      { id: '2', name: 'Calça Jeans Slim', sku: 'CAL-002', purchasePrice: 60.00, price: 129.90, stock: 12, category: 'Roupas', minStock: 5 },
      { id: '3', name: 'Tênis Esportivo', sku: 'TEN-003', purchasePrice: 150.00, price: 299.00, stock: 8, category: 'Calçados', minStock: 5 }
    ];
  },
  
  saveProducts: (products: Product[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }
};
