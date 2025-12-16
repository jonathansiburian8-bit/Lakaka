import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  LogOut, 
  Sparkles,
  Search,
  Trash2,
  FileText
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { Charts } from './Charts';
import { TransactionForm } from './TransactionForm';
import { analyzeFinances } from '../services/geminiService';

interface DashboardProps {
  onLogout: () => void;
}

// Dummy data for initial state (used only on first visit)
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-05-20', description: 'Omzet Harian', amount: 500000, type: TransactionType.INCOME, category: 'Pangkas' },
  { id: '2', date: '2024-05-21', description: 'Beli Bahan Kain', amount: 1200000, type: TransactionType.EXPENSE, category: 'Menjahit' },
  { id: '3', date: '2024-05-22', description: 'Jual Hasil Panen', amount: 750000, type: TransactionType.INCOME, category: 'Greenhouse' },
  { id: '4', date: '2024-05-23', description: 'Beli Tepung & Telur', amount: 300000, type: TransactionType.EXPENSE, category: 'Bakery' },
  { id: '5', date: '2024-05-24', description: 'Jasa Cuci Karpet', amount: 350000, type: TransactionType.INCOME, category: 'Laundry' },
  { id: '6', date: '2024-05-25', description: 'Beli Kawat Las', amount: 250000, type: TransactionType.EXPENSE, category: 'Las' },
];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // Initialize state from localStorage or fallback to initial data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedData = localStorage.getItem('finansialku_transactions');
      return savedData ? JSON.parse(savedData) : INITIAL_TRANSACTIONS;
    } catch (error) {
      console.error("Error parsing saved transactions:", error);
      return INITIAL_TRANSACTIONS;
    }
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Save to localStorage whenever transactions change
  useEffect(() => {
    try {
      localStorage.setItem('finansialku_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("Gagal menyimpan ke localStorage:", error);
      // Optional: alert user if storage is full
      // alert("Penyimpanan penuh! Transaksi mungkin tidak tersimpan. Hapus beberapa bukti transaksi.");
    }
  }, [transactions]);

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    // Removed window.confirm to streamline deletion and avoid browser blocking issues
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');
    const result = await analyzeFinances(transactions);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Laporan Keuangan</h1>
                <p className="text-xs text-gray-500">Halo, Giatjakitabisa</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Saldo</h3>
              <div className="p-2 bg-blue-50 rounded-full">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              Rp {balance.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Pemasukan</h3>
              <div className="p-2 bg-emerald-50 rounded-full">
                <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              + Rp {totalIncome.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">Pengeluaran</h3>
              <div className="p-2 bg-red-50 rounded-full">
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-600">
              - Rp {totalExpense.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               placeholder="Cari transaksi..."
               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleAnalyze}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>Loading...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analisis AI
                </>
              )}
            </button>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Transaksi Baru
            </button>
          </div>
        </div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 mb-8 animate-fade-in-down">
             <div className="flex items-center mb-4">
               <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
               <h3 className="text-lg font-bold text-purple-900">Analisis Penasihat Keuangan AI</h3>
             </div>
             <div className="prose prose-purple max-w-none text-gray-700 whitespace-pre-line">
               {aiAnalysis}
             </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="mb-8">
           <Charts transactions={transactions} />
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Riwayat Transaksi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length === 0 ? (
                  <tr>
                     <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                       Tidak ada transaksi ditemukan
                     </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === TransactionType.INCOME 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {tx.attachment ? (
                        <a 
                          href={tx.attachment} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                           <FileText className="w-4 h-4 mr-1" /> Lihat
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                      tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {tx.type === TransactionType.INCOME ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default Dashboard;