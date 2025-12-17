
import { BirthInfo, BaZiStructureExtended, PillarExtended, AnalysisResult, HiddenStem } from "../types";
// @ts-ignore
import { Solar, Lunar } from 'lunar-javascript';

// --- 1. 基础数据字典 (静态查表，不再依赖库的方法) ---

const WUXING: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

const YIN_YANG: Record<string, number> = {
  // 1 = Yang, 0 = Yin
  '甲': 1, '乙': 0, '丙': 1, '丁': 0, '戊': 1, '己': 0, '庚': 1, '辛': 0, '壬': 1, '癸': 0,
  // 地支藏干计算时主要看主气，或通过查表。此处仅用于计算十神，十神基于天干计算。
};

// 地支藏干表 (Standard Hidden Stems)
const ZANG_GAN: Record<string, string[]> = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '戊', '庚'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
};

// --- 2. 核心算法工具函数 ---

// 获取五行生克关系
const getWuxingRelation = (stemEl: string, dmEl: string): string => {
  const elements = ['木', '火', '土', '金', '水'];
  const idxS = elements.indexOf(stemEl);
  const idxD = elements.indexOf(dmEl);
  
  if (idxS === -1 || idxD === -1) return '';
  
  const diff = (idxD - idxS + 5) % 5;
  
  if (diff === 0) return 'Same';
  if (diff === 1) return 'Gen';   // 生我 (Resource)
  if (diff === 4) return 'GenBy'; // 我生 (Output)
  if (diff === 2) return 'Ctrl';  // 克我 (Power)
  if (diff === 3) return 'CtrlBy'; // 我克 (Wealth)
  
  return '';
};

// 计算十神
const calculateTenGod = (stemName: string, dmName: string): string => {
  if (!stemName || !dmName) return '';
  const stemEl = WUXING[stemName];
  const dmEl = WUXING[dmName];
  const stemYY = YIN_YANG[stemName];
  const dmYY = YIN_YANG[dmName];
  
  if (!stemEl || !dmEl || stemYY === undefined || dmYY === undefined) return '';

  const relation = getWuxingRelation(stemEl, dmEl);
  const sameYY = stemYY === dmYY;
  
  switch (relation) {
    case 'Same': return sameYY ? '比肩' : '劫财';
    case 'Gen': return sameYY ? '偏印' : '正印';
    case 'GenBy': return sameYY ? '食神' : '伤官';
    case 'CtrlBy': return sameYY ? '偏财' : '正财';
    case 'Ctrl': return sameYY ? '七杀' : '正官';
    default: return '';
  }
};

// 安全获取字符串
const safeString = (val: any): string => {
    if (typeof val === 'string') return val;
    if (val && typeof val.getName === 'function') return val.getName();
    return String(val || '');
};

// 构建单柱数据
const createPillar = (
    stemRaw: any, 
    branchRaw: any, 
    dayStemRaw: any, 
    isDayPillar: boolean
): PillarExtended => {
    
    // 强制转换为字符串，兼容库返回对象或字符串的情况
    const stem = safeString(stemRaw);
    const branch = safeString(branchRaw);
    const dayStem = safeString(dayStemRaw);

    // 1. 计算天干十神
    let tenGod = isDayPillar ? "日主" : calculateTenGod(stem, dayStem);
    
    // 2. 获取地支藏干
    const hiddenStemsList = ZANG_GAN[branch] || [];
    const hiddenStems: HiddenStem[] = hiddenStemsList.map(hStem => ({
        stem: hStem,
        element: WUXING[hStem]
    }));

    // 3. 计算支神 (藏干对应的十神)
    const branchGods = hiddenStemsList.map(hStem => calculateTenGod(hStem, dayStem));

    return {
        tenGod,
        stem,
        branch,
        hiddenStems,
        branchGods,
        naYin: "",      // 后续填充
        kongWang: "",   // 后续填充
        qiPhase: "",    // 后续填充
        shenSha: []     // 后续填充
    };
};

// --- 3. 主计算函数 ---

export const calculateBaZiLocal = (birthInfo: BirthInfo): AnalysisResult => {
  const [yearStr, monthStr, dayStr] = birthInfo.date.split('-');
  const [hourStr, minuteStr] = birthInfo.time.split(':');
  
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  let lunarObj: any;
  let solarObj: any;

  // 初始化历法对象
  if (birthInfo.calendarType === 'lunar') {
    lunarObj = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
    solarObj = lunarObj.getSolar();
  } else {
    solarObj = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    lunarObj = solarObj.getLunar();
  }

  const baZi = lunarObj.getEightChar();
  baZi.setSect(2); // 设置起运流派 (2=一般流派)

  // 获取核心干支 (这里假定库返回可能是字符串，createPillar 会处理)
  const dayStem = baZi.getDayGan();

  // 构建四柱
  const yearPillar = createPillar(baZi.getYearGan(), baZi.getYearZhi(), dayStem, false);
  const monthPillar = createPillar(baZi.getMonthGan(), baZi.getMonthZhi(), dayStem, false);
  const dayPillar = createPillar(baZi.getDayGan(), baZi.getDayZhi(), dayStem, true);
  const hourPillar = createPillar(baZi.getTimeGan(), baZi.getTimeZhi(), dayStem, false);

  // 填充纳音 (库通常返回字符串)
  yearPillar.naYin = safeString(baZi.getYearNaYin());
  monthPillar.naYin = safeString(baZi.getMonthNaYin());
  dayPillar.naYin = safeString(baZi.getDayNaYin());
  hourPillar.naYin = safeString(baZi.getTimeNaYin());

  // 填充空亡
  yearPillar.kongWang = safeString(baZi.getYearXunKong());
  monthPillar.kongWang = safeString(baZi.getMonthXunKong());
  dayPillar.kongWang = safeString(baZi.getDayXunKong());
  hourPillar.kongWang = safeString(baZi.getTimeXunKong());

  // 填充长生十二宫 (地势)
  yearPillar.qiPhase = safeString(baZi.getYearDiShi());
  monthPillar.qiPhase = safeString(baZi.getMonthDiShi());
  dayPillar.qiPhase = safeString(baZi.getDayDiShi());
  hourPillar.qiPhase = safeString(baZi.getTimeDiShi());

  // 计算节气信息
  // JieQi 对象通常有 getName() 方法
  const prevJieQi = lunarObj.getPrevJieQi(true);
  const nextJieQi = lunarObj.getNextJieQi(true);
  const prevName = safeString(prevJieQi);
  const nextName = safeString(nextJieQi);
  
  const solarTerm = `出生于${prevName}后，${nextName}前`;

  const pillars: BaZiStructureExtended = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };

  const interactions = {
    stems: "（待AI深度分析）",
    branches: "（待AI深度分析）"
  };

  return {
    solarTerm,
    pillars,
    interactions,
  };
};
