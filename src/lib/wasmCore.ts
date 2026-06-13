export interface WASMGeneticCore {
  computePolygenicRisk: (variantsPtr: number, weightsPtr: number, length: number) => number;
  monteCarloCross: (p1Ptr: number, p2Ptr: number, geneCount: number, iterations: number, outputPtr: number) => void;
  bayesianUpdate: (priorPtr: number, likelihoodPtr: number, posteriorPtr: number, size: number) => void;
}

let wasmInstance: WebAssembly.Instance | null = null;
let wasmMemory: WebAssembly.Memory | null = null;

export async function initWASM(): Promise<boolean> {
  try {
    // Try to load from public directory first
    let wasmResponse;
    
    try {
      wasmResponse = await fetch('/genetic-core.wasm');
    } catch {
      // If not found, use the fallback JS implementation
      console.warn('[WASM] Core not found, using JS fallback');
      return false;
    }
    
    if (!wasmResponse.ok) {
      console.warn('[WASM] Failed to load, using JS fallback');
      return false;
    }
    
    const contentType = wasmResponse.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      console.warn('[WASM] Invalid WASM file received, using JS fallback');
      return false;
    }
    
    const bytes = await wasmResponse.arrayBuffer();
    
    // Validate WASM magic number
    const view = new Uint8Array(bytes);
    if (view[0] !== 0x00 || view[1] !== 0x61 || view[2] !== 0x73 || view[3] !== 0x6d) {
      console.warn('[WASM] Invalid WASM magic number, using JS fallback');
      return false;
    }
    
    const result = await WebAssembly.instantiate(bytes, {
      env: {
        abort: () => console.error('[WASM] Abort called'),
        log: (ptr: number, len: number) => {
          if (wasmMemory) {
            const memory = new Uint8Array(wasmMemory.buffer);
            const str = new TextDecoder().decode(memory.slice(ptr, ptr + len));
            console.log('[WASM]:', str);
          }
        },
        emscripten_notify_memory_growth: () => {}
      }
    });
    
    wasmInstance = result.instance;
    wasmMemory = wasmInstance.exports.memory as WebAssembly.Memory;
    
    console.log('[WASM] Core loaded successfully');
    return true;
  } catch (error) {
    console.warn('[WASM] Failed to initialize:', error);
    return false;
  }
}

// JavaScript fallback implementations (no WASM dependency)
export class WASMFallback {
  computePolygenicRisk(variants: number[], weights: number[]): number {
    let riskScore = 0;
    let sumWeights = 0;
    for (let i = 0; i < variants.length; i++) {
      riskScore += variants[i] * weights[i];
      sumWeights += weights[i];
    }
    return sumWeights > 0 ? riskScore / sumWeights : 0;
  }
  
  monteCarloCross(p1Genes: number[], p2Genes: number[], iterations: number): number[] {
    const results: number[] = [];
    for (let iter = 0; iter < iterations; iter++) {
      let combinedScore = 0;
      for (let i = 0; i < p1Genes.length; i++) {
        const selected = Math.random() < 0.5 ? p1Genes[i] : p2Genes[i];
        combinedScore += selected / 255;
      }
      results.push(combinedScore / p1Genes.length);
    }
    return results;
  }
  
  bayesianUpdate(prior: number[], likelihood: number[]): number[] {
    let evidence = 0;
    for (let i = 0; i < prior.length; i++) {
      evidence += prior[i] * likelihood[i];
    }
    const posterior: number[] = [];
    for (let i = 0; i < prior.length; i++) {
      posterior.push((likelihood[i] * prior[i]) / evidence);
    }
    return posterior;
  }
}