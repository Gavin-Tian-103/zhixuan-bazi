
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// This service now ONLY handles the interpretation, not the calculation.
export const analyzeDestinyText = async (
    preCalculatedResult: AnalysisResult, 
    gender: 'male' | 'female'
): Promise<Partial<AnalysisResult>> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("系统配置错误: API Key 未找到。");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelId = "gemini-2.5-flash";

  // Serialize the pre-calculated chart to send to AI
  const chartJson = JSON.stringify(preCalculatedResult.pillars, null, 2);

  const prompt = `
    作为一位资深的命理大师，请根据以下已排好的八字盘面，进行精炼的运势分析。

    【命主信息】
    性别: ${gender === 'male' ? '男' : '女'}
    节气: ${preCalculatedResult.solarTerm}

    【八字盘面】
    ${chartJson}

    【任务要求】
    请直接对上述八字进行深度分析，**不需要**返回排盘数据（因为已经有了）。
    请分析以下五个维度，语言需专业、准确、富有哲理且通俗易懂：

    1. **五行喜忌**：分析八字格局强弱，判定喜用神。
    2. **性格分析**：基于日主和十神心性分析性格优缺点。
    3. **事业财运**：适合的行业、财运走势。
    4. **情感婚姻**：配偶宫及感情运势分析。
    5. **大师建议**：人生趋吉避凶的建议。
    6. **刑冲合害简述**：简要概括天干地支的主要作用关系（填充到 interactions 字段）。

    【返回格式】
    请仅返回 JSON 数据，不要包含 Markdown 格式标记。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interactions: {
                type: Type.OBJECT,
                properties: {
                  stems: { type: Type.STRING, description: "天干作用关系" },
                  branches: { type: Type.STRING, description: "地支作用关系" }
                }
            },
            wuxing: { type: Type.STRING },
            personality: { type: Type.STRING },
            career: { type: Type.STRING },
            relationships: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["interactions", "wuxing", "personality", "career", "relationships", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 返回为空");

    const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();
    const aiAnalysis = JSON.parse(cleanJson);

    return aiAnalysis;

  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};
