
export interface Product {
  id: string;
  name: string;
  sku: string;
  purchasePrice: number; // Preço de compra/custo
  price: number;         // Preço de venda
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
  purchaseValue: number; // Custo unitário na época da transação
  saleValue: number;     // Valor de venda unitário na época
  totalValue: number;    // Valor total (quantidade * saleValue)
  profit: number;        // Lucro líquido desta transação (apenas para OUT)
  customerName?: string;
}

export type View = 'dashboard' | 'inventory' | 'sales' | 'stock-in' | 'reports';
