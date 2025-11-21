import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import ResultsDisplay from './components/ResultsDisplay';
import { analyzeTongueImage } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelected = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = await convertFileToBase64(file);
      const analysis = await analyzeTongueImage(base64Data, file.type);
      
      if (analysis.diagnosisReasoning.toLowerCase().includes("error") && !analysis.visualFindings.color) {
          // Heuristic check if the model returned a polite error structure
          setError(analysis.diagnosisReasoning);
      } else {
          setResult(analysis);
      }

    } catch (err) {
      console.error(err);
      setError("Gagal menganalisis gambar. Pastikan API Key valid atau coba gambar lain.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Diagnosis Lidah TCM</h2>
            <p className="text-gray-500 mt-2">
              Unggah foto lidah pasien dalam pencahayaan alami untuk mendapatkan analisis sindrom TCM dan rekomendasi terapi.
            </p>
          </div>

          <UploadArea onImageSelected={handleImageSelected} isLoading={isLoading} />

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
              <p className="text-teal-700 font-medium text-lg">Sedang Menganalisis...</p>
              <p className="text-gray-400 text-sm">Mengidentifikasi pola Qi, Xue, Yin, dan Yang</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-center">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </div>

        {result && !isLoading && (
          <ResultsDisplay result={result} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} TCM Tongue Analyzer. Developed with React & Gemini API.
        </div>
      </footer>
    </div>
  );
};

export default App;