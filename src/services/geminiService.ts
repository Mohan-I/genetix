import { GoogleGenAI } from "@google/genai";
import { ParentProfile } from "../types";

// Debug logging
console.log("=== Environment Check ===");
console.log("All env vars:", Object.keys(import.meta.env));
console.log("VITE_GEMINI_API_KEY exists:", !!import.meta.env.VITE_GEMINI_API_KEY);

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Gemini API key is missing. Please check:");
  console.error("   1. .env file exists in project root");
  console.error("   2. Variable name is VITE_GEMINI_API_KEY");
  console.error("   3. No spaces or quotes around the value");
  console.error("   4. Dev server has been restarted");
}

// Only initialize if API key exists
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function analyzeGeneticProbability(parent1: ParentProfile, parent2: ParentProfile) {
  if (!genAI) {
    return `## ⚠️ API Key Not Configured

Please set up your Gemini API key:

1. Create a file named \`.env\` in the project root directory
2. Add this line: \`VITE_GEMINI_API_KEY=your_actual_api_key_here\`
3. Restart the development server

You can get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

Meanwhile, here's the analysis based on the calculated probabilities above.`;
  }

  const prompt = `
    As a Genetic Trait Probability Engine, analyze the offspring probability for the following parents:
    
    Parent 1 (Mother):
    - Eye Color: ${parent1.eyeColor}
    - Hair Texture: ${parent1.hairTexture}
    - Height: ${parent1.heightCm}cm
    - Blood Type: ${parent1.bloodType}
    - Thalassemia: ${parent1.thalassemia}
    - Myopic: ${parent1.myopia}
    - T2 Diabetes: ${parent1.diabetesT2}
    - Color Blindness: ${parent1.colorBlindness}
    - Maternal Age: ${parent1.maternalHealth?.age}
    - Blood Pressure: ${parent1.maternalHealth?.systolicBP}/${parent1.maternalHealth?.diastolicBP}
    - Glucose: ${parent1.maternalHealth?.glucoseLevel} mg/dL

    Parent 2 (Father):
    - Eye Color: ${parent2.eyeColor}
    - Hair Texture: ${parent2.hairTexture}
    - Height: ${parent2.heightCm}cm
    - Blood Type: ${parent2.bloodType}
    - Thalassemia: ${parent2.thalassemia}
    - Myopic: ${parent2.myopia}
    - T2 Diabetes: ${parent2.diabetesT2}
    - Color Blindness: ${parent2.colorBlindness}

    Provide a comprehensive genetic analysis in Markdown format with these sections:

    ## 🧬 Polygenic Trait Analysis
    - Height inheritance patterns and expected range
    - Skin tone polygenic contribution
    - Complex trait heritability estimates

    ## 🩺 Pathological Risk & Preventive Solutions
    - **Thalassemia**: Risk assessment based on carrier status
    - **Color Blindness**: X-linked inheritance probability
    - **Myopia**: Environmental and genetic factors
    - **Type 2 Diabetes**: Polygenic risk score interpretation
    - For each risk, provide specific preventive measures

    ## 🤰 Maternal Health & Pregnancy Risk
    - Age-related risk assessment
    - Cardiovascular considerations
    - Metabolic health evaluation
    - Specific recommendations for monitoring

    ## 🛡️ Preventive Medicine Protocol
    - Lifestyle modifications
    - Screening recommendations
    - Genetic counseling guidance

    ## ⚕️ Clinical Disclaimer
    Educational purposes only. Not for medical decision-making.

    Keep the tone professional, evidence-based, and educational. Use bullet points for clarity.
  `;

  try {
    // Try multiple model names for compatibility
    const models = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-pro'];
    let lastError = null;
    
    for (const model of models) {
      try {
        const response = await genAI.models.generateContent({
          model: model,
          contents: prompt,
        });
        return response.text || "Analysis complete. See probability distributions above.";
      } catch (error: any) {
        lastError = error;
        if (!error.message?.includes('not found')) {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('No available models');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return generateFallbackAnalysis(parent1, parent2);
  }
}

function generateFallbackAnalysis(parent1: ParentProfile, parent2: ParentProfile): string {
  const rhRisk = parent1.bloodType.includes('-') && parent2.bloodType.includes('+');
  
  return `## 🧬 Genetic Analysis Summary

### Polygenic Trait Inheritance

**Height Prediction**: With parents at ${parent1.heightCm}cm and ${parent2.heightCm}cm, the expected offspring height range is ${Math.round((parent1.heightCm + parent2.heightCm) / 2 - 10)}-${Math.round((parent1.heightCm + parent2.heightCm) / 2 + 10)}cm, following polygenic inheritance patterns with ~80% heritability.

**Eye Color Distribution**: Based on the parental combination of ${parent1.eyeColor} and ${parent2.eyeColor}, the probability distribution is shown in the chart above.

### Pathological Risk Assessment

**Thalassemia**: ${parent1.thalassemia !== 'None' || parent2.thalassemia !== 'None' ? 
  'Carrier status detected in one or both parents. Recommended: Partner screening and genetic counseling.' : 
  'No carrier status detected. Population-level risk only.'}

**Color Blindness**: ${parent1.colorBlindness || parent2.colorBlindness ? 
  'X-linked carrier pattern detected. Male offspring have elevated risk. Recommended: Pediatric vision screening.' : 
  'No family history detected. Standard vision screening recommended.'}

### Maternal Health Considerations

${parent1.maternalHealth?.age && parent1.maternalHealth.age > 35 ? 
  `⚠️ **Advanced Maternal Age**: Age ${parent1.maternalHealth.age} - Consider enhanced prenatal screening and genetic counseling.` : 
  `✓ Maternal age ${parent1.maternalHealth?.age} within optimal range.`}

${rhRisk ? 
  `⚠️ **Rh Incompatibility**: Rh-negative mother with Rh-positive father requires RhoGAM prophylaxis at 28 weeks and post-delivery to prevent HDN.` : 
  `✓ No Rh incompatibility detected.`}

### Preventive Recommendations

1. Schedule routine prenatal visits every 4 weeks until 28 weeks, then every 2-3 weeks
2. Complete carrier screening for conditions with elevated family history risk
3. Maintain healthy lifestyle with folic acid supplementation (400-800 mcg daily)
4. Consider non-invasive prenatal testing (NIPT) for chromosome abnormalities

---
*This analysis is generated from probabilistic models and is for educational purposes only. Please consult healthcare providers for medical decisions.*`;
}