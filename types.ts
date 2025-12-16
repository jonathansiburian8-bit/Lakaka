export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  attachment?: string;
}

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

// Daftar kategori unit usaha
const BUSINESS_CATEGORIES = [
  'Pangkas',
  'Menjahit',
  'Las',
  'Tenun',
  'Pertanian LT',
  'Greenhouse',
  'Doorsmeer',
  'Miniatur',
  'Bakery',
  'Laundry',
  'Kantor',
  'Lainnya'
];

export const INCOME_CATEGORIES = BUSINESS_CATEGORIES;

export const EXPENSE_CATEGORIES = BUSINESS_CATEGORIES;