import React from 'react';
import { PillarExtended } from '../types';

interface PillarCardProps {
  title: string;
  pillar: PillarExtended;
}

// Map stems/branches to colors for visual flair (Five Elements rough mapping)
const getElementColor = (char: string): string => {
  // Simple mapping for demo purposes. 
  // Wood: 甲乙寅卯 - Green
  // Fire: 丙丁巳午 - Red
  // Earth: 戊己辰戌丑未 - Yellow/Brown
  // Metal: 庚辛申酉 - Gray/Gold
  // Water: 壬癸亥子 - Blue/Black
  
  const wood = ['甲', '乙', '寅', '卯'];
  const fire = ['丙', '丁', '巳', '午'];
  const earth = ['戊', '己', '辰', '戌', '丑', '未'];
  const metal = ['庚', '辛', '申', '酉'];
  const water = ['壬', '癸', '亥', '子'];

  if (wood.includes(char)) return 'text-emerald-700';
  if (fire.includes(char)) return 'text-red-700';
  if (earth.includes(char)) return 'text-amber-700';
  if (metal.includes(char)) return 'text-slate-600';
  if (water.includes(char)) return 'text-blue-900';
  return 'text-stone-800';
};

export const PillarCard: React.FC<PillarCardProps> = ({ title, pillar }) => {
  return (
    <div className="flex flex-col items-center bg-stone-100 border-2 border-stone-200 rounded-lg p-4 shadow-sm min-w-[80px]">
      <span className="text-xs uppercase tracking-widest text-stone-500 mb-2 font-serif">{title}</span>
      <div className="flex flex-col items-center space-y-2 border border-stone-300 bg-white px-3 py-4 rounded shadow-inner">
        <span className={`text-3xl font-bold font-serif ${getElementColor(pillar.stem)}`}>
          {pillar.stem}
        </span>
        <span className={`text-3xl font-bold font-serif ${getElementColor(pillar.branch)}`}>
          {pillar.branch}
        </span>
      </div>
    </div>
  );
};