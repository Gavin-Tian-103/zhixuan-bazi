
export interface HiddenStem {
  stem: string;
  element: string; // e.g., '水'
}

export interface PillarExtended {
  tenGod: string; // e.g., 正印 (Stem Ten God)
  stem: string;   // e.g., 甲
  branch: string; // e.g., 申
  hiddenStems: HiddenStem[]; // e.g., [{stem: '庚', element: '金'}, ...]
  branchGods: string[]; // e.g., [正财, 正官] (Branch Ten Gods)
  naYin: string; // e.g., 井泉水
  kongWang: string; // e.g., 午未
  qiPhase: string; // e.g., 沐浴 (12 Life Stages)
  shenSha: string[]; // e.g., ['天乙贵人', '文昌贵人']
}

export interface BaZiStructureExtended {
  year: PillarExtended;
  month: PillarExtended;
  day: PillarExtended;
  hour: PillarExtended;
}

export interface AnalysisResult {
  solarTerm: string; // e.g., 出生于立冬后6天...
  pillars: BaZiStructureExtended;
  interactions: {
    stems: string; // e.g., 丁癸冲
    branches: string; // e.g., 卯酉相冲
  };
  // Analysis fields are now optional for progressive rendering
  wuxing?: string;
  personality?: string;
  career?: string;
  relationships?: string;
  advice?: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  CALCULATING = 'CALCULATING', // Local calculation
  ANALYZING = 'ANALYZING',     // AI generation
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface BirthInfo {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  gender: 'male' | 'female';
  calendarType: 'solar' | 'lunar';
}
