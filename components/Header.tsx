import React from 'react';
import { Compass } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-stone-900 text-stone-50 py-6 px-4 shadow-lg border-b-4 border-red-900">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-3">
        <Compass className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold tracking-widest font-serif">
          智玄八字
        </h1>
        <span className="text-stone-400 text-sm self-end mb-1 tracking-wider hidden sm:inline-block">
           | 洞悉天机 · 掌握命运
        </span>
      </div>
    </header>
  );
};