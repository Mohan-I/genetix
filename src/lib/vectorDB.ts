// Chroma-like vector database
export class VectorDatabase {
  private vectors: Map<string, Float32Array> = new Map();
  private metadata: Map<string, any> = new Map();
  private dimension: number;

  constructor(dimension: number) {
    this.dimension = dimension;
  }

  add(id: string, vector: Float32Array, metadata: any = {}): void {
    if (vector.length !== this.dimension) {
      throw new Error(`Vector dimension mismatch: expected ${this.dimension}, got ${vector.length}`);
    }
    this.vectors.set(id, vector);
    this.metadata.set(id, metadata);
  }

  async search(queryVector: Float32Array, k: number = 10): Promise<Array<{id: string, score: number, metadata: any}>> {
    const results: Array<{id: string, score: number, metadata: any}> = [];
    
    for (const [id, vector] of this.vectors.entries()) {
      const similarity = this.cosineSimilarity(queryVector, vector);
      results.push({
        id,
        score: similarity,
        metadata: this.metadata.get(id)
      });
    }
    
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, k);
  }

  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async loadFromIndexedDB(storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('GeneticVectorDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const getAll = store.getAll();
        
        getAll.onsuccess = () => {
          getAll.result.forEach(item => {
            this.add(item.id, new Float32Array(item.vector), item.metadata);
          });
          resolve();
        };
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}