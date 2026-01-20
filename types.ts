
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  minStock: number;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  totalValue: number;
  customerName?: string;
}

export type View = 'dashboard' | 'inventory' | 'sales' | 'reports';
