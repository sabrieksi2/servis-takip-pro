
import { GoogleGenAI } from "@google/genai";
import { Student, PaymentRecord } from "../types";

export const getPaymentAnalysis = async (students: Student[], payments: PaymentRecord[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const unpaidStudents = students.filter(s => {
    const studentPayments = payments.filter(p => p.studentId === s.id && p.status === 'paid');
    return studentPayments.length === 0; // Simple logic for demonstration
  });

  const prompt = `
    Aşağıda ödeme durumu verileri verilmiştir. Bu verileri analiz et ve servis şoförü arkadaşım için kısa, samimi bir özet çıkar. 
    Ayrıca borcu olan veliler için nazik bir WhatsApp hatırlatma mesajı taslağı oluştur.
    
    Öğrenci Sayısı: ${students.length}
    Ödeme Yapmayan Örnek Öğrenciler: ${unpaidStudents.slice(0, 3).map(s => s.name).join(', ')}
    
    Lütfen Türkçe cevap ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Analiz şu an yapılamıyor, lütfen daha sonra tekrar deneyin.";
  }
};
