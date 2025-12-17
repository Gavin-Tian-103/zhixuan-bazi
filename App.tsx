
import React, { useState } from 'react';
import { Header } from './components/Header';
import { BaZiGrid } from './components/BaZiGrid';
import { AnalysisSection } from './components/AnalysisSection';
import { analyzeDestinyText } from './services/geminiService';
import { calculateBaZiLocal } from './services/baziCalculator';
import { AnalysisResult, BirthInfo, LoadingState } from './types';
import { 
  User, 
  Briefcase, 
  Heart, 
  Sparkles, 
  Flame, 
  Loader2,
  Calendar,
  Clock,
  Moon,
  Sun,
  Info,
  AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    date: '',
    time: '',
    gender: 'male',
    calendarType: 'solar',
  });
  
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthInfo.date || !birthInfo.time) {
      setError("请完整填写出生日期和时间");
      return;
    }

    setError(null);
    setResult(null);

    try {
      // 1. Instant Phase: Local Calculation (0ms latency)
      setLoadingState(LoadingState.CALCULATING);
      const localResult = calculateBaZiLocal(birthInfo);
      
      // Render the grid immediately
      setResult(localResult);
      setLoadingState(LoadingState.ANALYZING);

      // 2. Async Phase: AI Interpretation
      const aiResult = await analyzeDestinyText(localResult, birthInfo.gender);
      
      // Merge results
      setResult(prev => {
          if (!prev) return null;
          return {
              ...prev,
              ...aiResult,
              // Merge interactions intelligently if AI provides better text
              interactions: aiResult.interactions || prev.interactions
          };
      });
      setLoadingState(LoadingState.SUCCESS);

    } catch (err: any) {
      console.error("Process Error:", err);
      // Even if AI fails, we might still have the chart. 
      // If we have result (chart), we just show a warning for the text part.
      if (result) {
          setError("排盘成功，但AI深度分析服务暂时不可用。");
          setLoadingState(LoadingState.SUCCESS); // Treat as partial success
      } else {
          const msg = err instanceof Error ? err.message : String(err);
          setError(msg || "系统错误，请重试");
          setLoadingState(LoadingState.ERROR);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9]">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Input Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-stone-800 via-red-800 to-stone-800"></div>
          
          <h2 className="text-2xl font-bold text-center text-stone-800 mb-6 font-serif">请输入生辰信息</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            
            {/* Calendar Type Selection */}
            <div className="space-y-2">
              <label className="text-stone-600 font-medium block">历法选择</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setBirthInfo({ ...birthInfo, calendarType: 'solar' })}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all font-serif flex items-center justify-center gap-2 ${
                    birthInfo.calendarType === 'solar'
                      ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  公历 (阳历)
                </button>
                <button
                  type="button"
                  onClick={() => setBirthInfo({ ...birthInfo, calendarType: 'lunar' })}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all font-serif flex items-center justify-center gap-2 ${
                    birthInfo.calendarType === 'lunar'
                      ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  农历 (阴历)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-stone-600 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {birthInfo.calendarType === 'solar' ? '出生日期 (公历)' : '出生日期 (农历)'}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none transition-all bg-stone-50"
                  value={birthInfo.date}
                  onChange={(e) => setBirthInfo({ ...birthInfo, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-stone-600 font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  出生时间
                </label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none transition-all bg-stone-50"
                  value={birthInfo.time}
                  onChange={(e) => setBirthInfo({ ...birthInfo, time: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-stone-600 font-medium block">性别</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setBirthInfo({ ...birthInfo, gender: 'male' })}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all font-serif ${
                    birthInfo.gender === 'male'
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  乾造 (男)
                </button>
                <button
                  type="button"
                  onClick={() => setBirthInfo({ ...birthInfo, gender: 'female' })}
                  className={`flex-1 py-3 px-4 rounded-lg border transition-all font-serif ${
                    birthInfo.gender === 'female'
                      ? 'bg-red-900 text-white border-red-900'
                      : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  坤造 (女)
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loadingState === LoadingState.ANALYZING || loadingState === LoadingState.CALCULATING}
                className="w-full py-4 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-amber-50 font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                {loadingState === LoadingState.CALCULATING || loadingState === LoadingState.ANALYZING ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    {loadingState === LoadingState.CALCULATING ? "正在排盘..." : "大师分析中..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    开始排盘分析
                  </>
                )}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-800 border border-red-100 rounded-lg flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Results Section - Render if we have a result (even partial) */}
        {result && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Meta Info */}
            <div className="bg-transparent px-2 mb-[-1rem] flex flex-col md:flex-row gap-2 text-stone-500 text-sm font-serif">
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>真太阳时参考: {birthInfo.date} {birthInfo.time}</span>
                </div>
                <div className="hidden md:block">|</div>
                <div className="flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    <span>出生节气: {result.solarTerm}</span>
                </div>
            </div>

            {/* BaZi Grid System - ALWAYS VISIBLE once calculated */}
            <section className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-stone-800">
               <BaZiGrid pillars={result.pillars} interactions={result.interactions} />
            </section>

            {/* Analysis Sections - Show Skeleton/Loader if analyzing */}
            {loadingState === LoadingState.ANALYZING ? (
                <div className="p-8 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <Loader2 className="w-10 h-10 text-stone-400 animate-spin" />
                    <p className="text-stone-500 font-serif text-lg">正在推演命理玄机，请稍候...</p>
                    <div className="w-full max-w-lg space-y-3">
                        <div className="h-4 bg-stone-100 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-stone-100 rounded w-full mx-auto"></div>
                        <div className="h-4 bg-stone-100 rounded w-5/6 mx-auto"></div>
                    </div>
                </div>
            ) : (
               <>
                {/* Wuxing Summary */}
                {result.wuxing && (
                    <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 shadow-sm animate-fade-in">
                        <h4 className="text-base font-bold text-stone-700 mb-3 uppercase tracking-wider flex items-center">
                            <Flame className="w-5 h-5 mr-2 text-red-600" />
                            五行强弱与喜忌
                        </h4>
                        <p className="text-stone-800 leading-relaxed text-justify">{result.wuxing}</p>
                    </div>
                )}

                {/* Detailed Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.personality && <AnalysisSection title="性格分析" content={result.personality} icon={User} colorClass="text-emerald-700" />}
                  {result.career && <AnalysisSection title="事业财运" content={result.career} icon={Briefcase} colorClass="text-amber-700" />}
                  {result.relationships && <AnalysisSection title="婚恋情感" content={result.relationships} icon={Heart} colorClass="text-rose-700" />}
                  {result.advice && <AnalysisSection title="大师建议" content={result.advice} icon={Sparkles} colorClass="text-purple-700" />}
                </div>
               </>
            )}

            <div className="text-center text-stone-400 text-xs mt-8 pb-8">
               <p>注：命理分析仅供参考，命运掌握在自己手中。</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
