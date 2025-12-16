import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinances = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) {
    return "API Key tidak ditemukan. Harap konfigurasi environment variable API_KEY.";
  }

  // Prepare data for the prompt
  const income = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const expense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  const summary = transactions.map(t => 
    `- ${t.date}: ${t.description} (${t.type}) - Rp ${t.amount.toLocaleString('id-ID')} [${t.category}]`
  ).join('\n');

  const prompt = `
    Bertindaklah sebagai penasihat keuangan pribadi yang profesional.
    Berikut adalah ringkasan data keuangan saya saat ini:
    
    Total Pemasukan: Rp ${income.toLocaleString('id-ID')}
    Total Pengeluaran: Rp ${expense.toLocaleString('id-ID')}
    Saldo Saat Ini: Rp ${balance.toLocaleString('id-ID')}

    Daftar Transaksi Terakhir:
    ${summary.slice(0, 2000)} ${summary.length > 2000 ? '...(dan lainnya)' : ''}

    Berikan analisis singkat (maksimal 3 paragraf) mengenai kesehatan keuangan saya.
    Sertakan 3 saran praktis (bullet points) untuk menghemat uang atau meningkatkan kondisi keuangan berdasarkan kategori pengeluaran saya.
    Gunakan Bahasa Indonesia yang sopan dan memotivasi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Maaf, saya tidak dapat menghasilkan analisis saat ini.";
  } catch (error) {
    console.error("Error analyzing finances:", error);
    return "Terjadi kesalahan saat menghubungkan ke asisten AI. Silakan coba lagi nanti.";
  }
};