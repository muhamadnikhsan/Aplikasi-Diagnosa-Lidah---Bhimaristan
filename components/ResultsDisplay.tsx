import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const Card: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const ListItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 text-sm font-medium">{label}</span>
    <span className="text-gray-800 font-medium mt-1 sm:mt-0">{value}</span>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { visualFindings, tcmPattern, diagnosisReasoning, treatment, icd10 } = result;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Visual Findings */}
      <Card 
        title="A. Temuan Visual" 
        icon={
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <ListItem label="Warna Tubuh" value={visualFindings.color} />
          <ListItem label="Bentuk" value={visualFindings.shape} />
          <ListItem label="Selaput (Coating)" value={visualFindings.coating} />
          <ListItem label="Kelembapan" value={visualFindings.moisture} />
          <ListItem label="Retakan (Fissures)" value={visualFindings.fissures} />
          <ListItem label="Fitur Lain" value={visualFindings.features} />
        </div>
      </Card>

      {/* 2. TCM Pattern */}
      <Card 
        title="B. Pola TCM (Sindrom)" 
        icon={
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <ListItem label="Zat Vital (Qi/Xue/Yin/Yang)" value={tcmPattern.vitalSubstances} />
          <ListItem label="Organ Zang Fu" value={tcmPattern.zangFu} />
          <ListItem label="Kondisi (Shi/Xu)" value={tcmPattern.condition} />
          <ListItem label="Patogen" value={tcmPattern.pathogen} />
        </div>
      </Card>

      {/* 3. Reasoning */}
      <Card 
        title="C. Diagnosis & Analisis" 
        icon={
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        }
      >
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{diagnosisReasoning}</p>
      </Card>

      {/* 4. Treatment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          title="D. Titik Akupunktur" 
          icon={
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
               <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
            </svg>
          }
        >
           <div className="mb-4">
             <p className="text-sm text-gray-500 mb-1">Teknik:</p>
             <p className="font-medium text-teal-800 bg-teal-50 inline-block px-2 py-1 rounded">{treatment.technique}</p>
           </div>
           <div className="flex flex-wrap gap-2">
             {treatment.acupuncturePoints.map((point, idx) => (
               <span key={idx} className="bg-white border border-teal-200 text-teal-700 px-3 py-1 rounded-lg shadow-sm text-sm font-semibold">
                 {point}
               </span>
             ))}
           </div>
        </Card>

        <Card 
          title="E. Herbal" 
          icon={
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <ul className="space-y-2">
            {treatment.herbalRecommendations.map((herb, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-green-500 mt-1">•</span>
                <span className="text-gray-700">{herb}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 5. ICD-10 */}
      <Card 
        title="F. Kemungkinan ICD-10" 
        icon={
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-purple-50 text-purple-900 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Kode</th>
                <th className="px-4 py-3 rounded-tr-lg">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {icd10.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-bold text-purple-700 whitespace-nowrap">{item.code}</td>
                  <td className="px-4 py-3 text-gray-600">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg text-xs mt-8">
        <strong>Disclaimer:</strong> Hasil analisis ini dihasilkan oleh AI untuk tujuan edukasi dan referensi saja. 
        Tidak menggantikan diagnosis dan tindakan medis profesional. Konsultasikan dengan praktisi TCM atau dokter berlisensi.
      </div>
    </div>
  );
};

export default ResultsDisplay;