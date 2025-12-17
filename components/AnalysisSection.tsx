import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalysisSectionProps {
  title: string;
  content: string;
  icon: LucideIcon;
  colorClass?: string;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, content, icon: Icon, colorClass = "text-stone-800" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-2">
        <Icon className={`w-6 h-6 ${colorClass}`} />
        <h3 className="text-xl font-bold text-stone-800">{title}</h3>
      </div>
      <p className="text-stone-600 leading-relaxed whitespace-pre-line text-justify">
        {content}
      </p>
    </div>
  );
};