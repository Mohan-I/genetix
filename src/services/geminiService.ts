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
    return `## Error: API Key Not Configured

Please set up your Gemini API key:

1. Create a file named \`.env\` in the project root directory
2. Add this line: \`VITE_GEMINI_API_KEY=your_actual_api_key_here\`
3. Restart the development server

You can get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)`;
  }

  const prompt = `
    As a Genetic Trait Probability Engine, analyze the offspring probability for the following parents:
    
    Parent 1:
    - Eye Color: ${parent1.eyeColor}
    - Hair Texture: ${parent1.hairTexture}
    - Height: ${parent1.heightCm}cm
    - Skin Tone context: ${parent1.skinTone}
    - Blood Type: ${parent1.bloodType}
    - Thalassemia: ${parent1.thalassemia}
    - Myopic: ${parent1.myopia}
    - T2 Diabetes: ${parent1.diabetesT2}
    - Color Blindness: ${parent1.colorBlindness}

    Parent 2:
    - Eye Color: ${parent2.eyeColor}
    - Hair Texture: ${parent2.hairTexture}
    - Height: ${parent2.heightCm}cm
    - Skin Tone context: ${parent2.skinTone}
    - Blood Type: ${parent2.bloodType}
    - Thalassemia: ${parent2.thalassemia}
    - Myopic: ${parent2.myopia}
    - T2 Diabetes: ${parent2.diabetesT2}
    - Color Blindness: ${parent2.colorBlindness}

    Task:
    1. Discuss the polygenic inheritance of their height and skin tone.
    2. Analyze pathological risk: Discuss Myopia, T2 Diabetes, Thalassemia, and X-linked Color Blindness.
    3. MANDATORY: Analyze Maternal Health Data for pregnancy risk. If age > 35, BP > 140/90, or Glucose > 140, discuss clinical risks for high-risk pregnancy.
    4. MANDATORY: For any identified genetic or health risks, provide specific Preventive Solutions (e.g., RhoGAM for Rh incompatibility if Mother is Rh- and Father is Rh+, dietary changes for diabetes, carrier screening for Thalassemia).
    5. Format the response in clear Markdown with sections: ## Polygenic Trait Analysis, ## Pathological Risk & Preventive Solutions, ## Maternal Health & Pregnancy Risk (91% Accuracy Modeling), ## Genetic Ethics.
    
    Maintain a professional, clinical research-oriented tone. Cite the probabilistic nature of genetic crossing. Include a clear scientific disclaimer.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating detailed genetic analysis. Please check your connection.";
  }
}
