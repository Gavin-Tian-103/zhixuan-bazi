import React from 'react';
import { BaZiStructureExtended, PillarExtended } from '../types';

interface BaZiGridProps {
  pillars: BaZiStructureExtended;
  interactions: {
    stems: string;
    branches: string;
  };
}

// Visual Helpers
const getStemColor = (char: string) => {
  const map: Record<string, string> = {
    '甲': 'text-emerald-600', '乙': 'text-emerald-600',
    '丙': 'text-red-600', '丁': 'text-red-600',
    '戊': 'text-amber-600', '己': 'text-amber-600',
    '庚': 'text-yellow-600', '辛': 'text-yellow-600',
    '壬': 'text-blue-600', '癸': 'text-blue-600',
  };
  return map[char] || 'text-stone-800';
};

const getBranchColor = (char: string) => {
  const map: Record<string, string> = {
    '寅': 'text-emerald-600', '卯': 'text-emerald-600',
    '巳': 'text-red-600', '午': 'text-red-600',
    '辰': 'text-amber-600', '戌': 'text-amber-600', '丑': 'text-amber-600', '未': 'text-amber-600',
    '申': 'text-yellow-600', '酉': 'text-yellow-600',
    '亥': 'text-blue-600', '子': 'text-blue-600',
  };
  return map[char] || 'text-stone-800';
};

const getGodColor = (god: string) => {
    if (god === '日主' || god === '元男' || god === '元女') return 'text-stone-900 font-bold';
    if (god.includes('印')) return 'text-emerald-600';
    if (god.includes('官') || god.includes('杀')) return 'text-blue-600';
    if (god.includes('财')) return 'text-amber-600';
    if (god.includes('食') || god.includes('伤')) return 'text-yellow-600';
    if (god.includes('比') || god.includes('劫')) return 'text-red-600';
    return 'text-stone-500';
}

const RowHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center p-2 text-xs md:text-sm text-stone-400 font-serif tracking-widest bg-stone-50/50">
    {children}
  </div>
);

const Cell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`flex flex-col items-center justify-center p-2 text-center border-l border-stone-100 ${className}`}>
    {children}
  </div>
);

const PillarColumn: React.FC<{ pillar: PillarExtended; type: 'year' | 'month' | 'day' | 'hour' }> = ({ pillar, type }) => {
    return null; // Used for logical grouping if needed, but we iterate rows instead
}

export const BaZiGrid: React.FC<BaZiGridProps> = ({ pillars, interactions }) => {
  const pillarList = [pillars.year, pillars.month, pillars.day, pillars.hour];
  const headers = ['年柱', '月柱', '日柱', '时柱'];

  return (
    <div className="w-full bg-[#fdfdfc] rounded-lg shadow-sm border border-stone-200 overflow-hidden font-serif select-text">
      {/* Header Row */}
      <div className="grid grid-cols-5 border-b border-stone-200 bg-stone-100/50">
        <div className="p-2"></div>
        {headers.map((h, i) => (
          <div key={i} className="p-3 text-center text-stone-600 font-bold text-sm md:text-base border-l border-stone-200">
            {h}
          </div>
        ))}
      </div>

      {/* Ten Gods (Stem) */}
      <div className="grid grid-cols-5 border-b border-stone-100 min-h-[40px]">
        <RowHeader>干神</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i}>
            <span className={`text-xs md:text-sm ${getGodColor(p.tenGod)}`}>{p.tenGod}</span>
          </Cell>
        ))}
      </div>

      {/* Heavenly Stems */}
      <div className="grid grid-cols-5 border-b border-stone-100">
        <RowHeader>天干</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i} className="py-2">
            <span className={`text-3xl md:text-4xl font-bold ${getStemColor(p.stem)}`}>{p.stem}</span>
          </Cell>
        ))}
      </div>

      {/* Earthly Branches */}
      <div className="grid grid-cols-5 border-b border-stone-100">
        <RowHeader>地支</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i} className="py-2">
            <span className={`text-3xl md:text-4xl font-bold ${getBranchColor(p.branch)}`}>{p.branch}</span>
          </Cell>
        ))}
      </div>

      {/* Hidden Stems */}
      <div className="grid grid-cols-5 border-b border-stone-100 bg-stone-50/30">
        <RowHeader>藏干</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i} className="space-y-1">
            {p.hiddenStems.map((hs, idx) => (
              <div key={idx} className="text-xs text-stone-500 flex gap-1">
                <span className={getStemColor(hs.stem)}>{hs.stem}</span>
                <span className="opacity-50">·</span>
                <span className="text-stone-400 scale-90">{hs.element}</span>
              </div>
            ))}
          </Cell>
        ))}
      </div>

      {/* Branch Gods */}
      <div className="grid grid-cols-5 border-b border-stone-100 bg-stone-50/30">
        <RowHeader>支神</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i} className="space-y-1">
            {p.branchGods.map((god, idx) => (
              <span key={idx} className={`text-xs block ${getGodColor(god)}`}>{god}</span>
            ))}
          </Cell>
        ))}
      </div>

      {/* Na Yin */}
      <div className="grid grid-cols-5 border-b border-stone-100">
        <RowHeader>纳音</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i}>
            <span className="text-xs md:text-sm text-stone-600">{p.naYin}</span>
          </Cell>
        ))}
      </div>
      
      {/* Kong Wang */}
      <div className="grid grid-cols-5 border-b border-stone-100">
        <RowHeader>空亡</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i}>
            <span className="text-xs text-stone-500">{p.kongWang}</span>
          </Cell>
        ))}
      </div>

      {/* Qi Phase (Di Shi) */}
      <div className="grid grid-cols-5 border-b border-stone-100">
        <RowHeader>地势</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i}>
            <span className="text-xs md:text-sm text-stone-700">{p.qiPhase}</span>
          </Cell>
        ))}
      </div>

      {/* Shen Sha */}
      <div className="grid grid-cols-5 bg-stone-50/50">
        <RowHeader>神煞</RowHeader>
        {pillarList.map((p, i) => (
          <Cell key={i} className="py-3 justify-start">
            <div className="flex flex-col gap-1">
                {p.shenSha.map((s, idx) => (
                <span key={idx} className="text-[10px] md:text-xs text-stone-500 leading-tight whitespace-nowrap">{s}</span>
                ))}
            </div>
          </Cell>
        ))}
      </div>

      {/* Interactions Footer */}
       <div className="border-t border-stone-200 p-4 bg-stone-100/50 text-xs md:text-sm">
         <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <div className="flex gap-2">
                <span className="text-stone-400 font-bold">天干:</span>
                <span className="text-stone-700">{interactions.stems || "无明显刑冲"}</span>
            </div>
            <div className="flex gap-2">
                <span className="text-stone-400 font-bold">地支:</span>
                <span className="text-stone-700">{interactions.branches || "无明显刑冲"}</span>
            </div>
         </div>
       </div>
    </div>
  );
};