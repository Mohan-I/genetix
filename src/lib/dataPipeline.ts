// dataPipeline.ts - Dynamic prior extraction from genomic datasets
import Papa from 'papaparse';

export interface GenomicFrequency {
  snpId: string;
  allele: string;
  frequency: number;
  population: string;
  phenotype: string;
}

export class GenomicDataPipeline {
  private frequencyDatabase: Map<string, GenomicFrequency[]> = new Map();
  private geographicPriors: Map<string, Map<string, number>> = new Map();

  async load1000GenomesData(url: string): Promise<void> {
    const response = await fetch(url);
    const csvText = await response.text();
    
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        results.data.forEach((row: any) => {
          const freq: GenomicFrequency = {
            snpId: row['#RSID'],
            allele: row['Allele'],
            frequency: row['Frequency'],
            population: row['Population'],
            phenotype: row['Phenotype']
          };
          
          if (!this.frequencyDatabase.has(freq.snpId)) {
            this.frequencyDatabase.set(freq.snpId, []);
          }
          this.frequencyDatabase.get(freq.snpId)!.push(freq);
        });
      }
    });
  }

  computeGeographicPrior(population: string, traits: string[]): Map<string, number> {
    const prior = new Map<string, number>();
    
    traits.forEach(trait => {
      let totalFreq = 0;
      let count = 0;
      
      this.frequencyDatabase.forEach((frequencies, snpId) => {
        const popFreq = frequencies.find(f => f.population === population && f.phenotype === trait);
        if (popFreq) {
          totalFreq += popFreq.frequency;
          count++;
        }
      });
      
      prior.set(trait, count > 0 ? totalFreq / count : 0.5);
    });
    
    this.geographicPriors.set(population, prior);
    return prior;
  }

  async fetchEnsemblPhenotypes(geneIds: string[]): Promise<any> {
    const endpoint = 'https://rest.ensembl.org/phenotype/';
    const results = [];
    
    for (const geneId of geneIds) {
      const response = await fetch(`${endpoint}gene/${geneId}?content-type=application/json`);
      const data = await response.json();
      results.push(data);
    }
    
    return results;
  }
}