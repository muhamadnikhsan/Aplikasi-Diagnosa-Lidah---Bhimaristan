import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-teal-700 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">TCM Tongue Analyzer AI</h1>
          <p className="text-teal-100 text-sm mt-1">Diagnosis Lidah Cerdas & Terintegrasi</p>
        </div>
        <div className="hidden sm:block">
            <span className="bg-teal-800 px-3 py-1 rounded-full text-xs font-medium text-teal-200 border border-teal-600">
                Powered by Gemini 2.5
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;