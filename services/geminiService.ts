
import { GoogleGenAI } from "@google/genai";
import { Transaction, TransactionType } from "../types";

export const analyzeFinances = async (transactions: Transaction[]): Promise<string> => {
  // Fix: Check process.env.API_KEY directly to ensure it is configured.
  if (!process.env.API_KEY || process.env.API_KEY.trim() === '') {
    return "API Key tidak ditemukan. Harap pastikan environment variable API_KEY sudah diset di dashboard hosting Anda (Vercel/Netlify).";
  }

  try {
    // Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) directly to initialize the client.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expense;

    const summary = transactions.slice(0, 40).map(t => 
      `- ${t.date}: ${t.description} (${t.type}) - Rp ${t.amount.toLocaleString('id-ID')} [${t.category}]`
    ).join('\n');

    const prompt = `
      Bertindaklah sebagai penasihat keuangan pribadi yang profesional.
      Berikut adalah ringkasan data keuangan saya:
      
      Total Pemasukan: Rp ${income.toLocaleString('id-ID')}
      Total Pengeluaran: Rp ${expense.toLocaleString('id-ID')}
      Saldo Saat Ini: Rp ${balance.toLocaleString('id-ID')}

      Data Transaksi Terakhir:
      ${summary}

      Berikan analisis singkat (maksimal 3 paragraf) mengenai kesehatan keuangan saya.
      Sertakan 3 saran praktis (bullet points) untuk menghemat uang atau meningkatkan kondisi keuangan.
      Gunakan Bahasa Indonesia yang sopan dan memotivasi.
    `;

    // Fix: Use ai.models.generateContent with the model name and contents property as defined in the guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Fix: Access the .text property directly (not as a method call) to get the generated content.
    return response.text || "Maaf, saya tidak dapat menghasilkan analisis saat ini.";
  } catch (error: any) {
    console.error("Error analyzing finances:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "API Key yang Anda gunakan tidak valid. Silakan periksa kembali di Google AI Studio.";
    }
    return "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.";
  }
};
