// src/lib/localLLM.ts - Local embedding and RAG system
import { pipeline, env } from '@xenova/transformers';
import { VectorDatabase } from './vectorDB';

env.localModelPath = '/models/';

export interface MedicalKnowledge {
  condition: string;
  probability: number;
  description: string;
  references: string[];
  treatmentNotes: string;
}

export class LocalGeneticLLM {
  private embeddingModel: any;
  private llmModel: any;
  private vectorDB: VectorDatabase;
  private medicalKnowledgeBase: MedicalKnowledge[] = [];

  constructor() {
    this.vectorDB = new VectorDatabase(768); // BERT embedding dimension
  }

  async initialize() {
    // Load quantized embedding model (runs locally)
    this.embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    // Load tiny LLM for genetic analysis
    this.llmModel = await pipeline('text-generation', 'Xenova/TinyLlama-1.1B');
  }

  async augmentWithRAG(probabilities: TraitProbability[]): Promise<string> {
    // Convert probabilities to query vector
    const queryText = probabilities.map(p => `${p.label}:${(p.affected * 100).toFixed(1)}%`).join(', ');
    const queryEmbedding = await this.embeddingModel(queryText);
    
    // Retrieve relevant medical knowledge
    const relevantDocs = await this.vectorDB.search(queryEmbedding.data, 5);
    
    // Build prompt with retrieved context
    const prompt = this.buildRAGPrompt(probabilities, relevantDocs);
    
    // Generate response with local model
    const response = await this.llmModel(prompt, {
      max_new_tokens: 500,
      temperature: 0.3,
      do_sample: true
    });
    
    return response[0].generated_text;
  }

  private buildRAGPrompt(probs: TraitProbability[], docs: any[]): string {
    return `You are a medical genetics AI. Analyze these probabilities and provide insights.
    
Probabilities:
${probs.map(p => `- ${p.label}: ${(p.affected * 100).toFixed(1)}%`).join('\n')}

Medical Literature Context:
${docs.map(d => d.content).join('\n')}

Provide a concise genetic analysis focusing on:
1. Most significant risks (>15% probability)
2. Gene-environment interactions
3. Clinical recommendations

Analysis:`;
  }
}