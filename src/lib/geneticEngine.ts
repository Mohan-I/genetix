import { BloodType, EyeColor, TraitProbability, PathologyStatus, PathologyRisk, ParentProfile, MaternalHealthData } from '../types';

/**
 * Mendelian logic for Autosomal Recessive conditions (e.g., Thalassemia)
 */
export function calculateAutosomalRecessiveRisk(p1: PathologyStatus, p2: PathologyStatus): { affected: number, carrier: number } {
  const getGenes = (s: PathologyStatus) => {
    if (s === PathologyStatus.AFFECTED) return ['r', 'r'];
    if (s === PathologyStatus.CARRIER) return ['R', 'r'];
    return ['R', 'R'];
  };

  const g1 = getGenes(p1);
  const g2 = getGenes(p2);

  let affected = 0;
  let carrier = 0;

  for (const a of g1) {
    for (const b of g2) {
      const combo = [a, b].sort().join('');
      if (combo === 'rr') affected++;
      else if (combo === 'Rr') carrier++;
    }
  }

  return { affected: affected / 4, carrier: carrier / 4 };
}

/**
 * Simplified X-linked Recessive Risk (e.g. Color Blindness)
 * Assuming Parent A is XX and Parent B is XY
 */
export function calculateXLinkedRisk(p1Affected: boolean, p2Affected: boolean): { maleAffected: number, femaleCarrier: number, femaleAffected: number } {
  // P1 (Mother): XX. If affected, she is X'X'. If carrier, she is X'X (we don't have carrier status for simplicity here, but let's assume if "true" she is affected)
  // P2 (Father): XY. If affected, he is X'Y.
  
  // Let's assume for this simulation:
  // p1Affected = Mother is affected (X'X')
  // p2Affected = Father is affected (X'Y)
  
  // Realistically we'd need Mother Carrier status. Let's upgrade the profile later or assume boolean means affected.
  // For now: Mother affected -> 100% of sons affected, 100% of daughters carriers/affected depending on father.
  
  return {
    maleAffected: p1Affected ? 1.0 : 0.0,
    femaleCarrier: (!p1Affected && p2Affected) ? 1.0 : 0.0,
    femaleAffected: (p1Affected && p2Affected) ? 1.0 : 0.0
  };
}

/**
 * Polygenic Risk Assessment
 */
export function calculatePathologyRisks(p1: ParentProfile, p2: ParentProfile): PathologyRisk[] {
  const risks: PathologyRisk[] = [];

  // Myopia logic
  let myopiaRisk = 0.10;
  if (p1.myopia && p2.myopia) myopiaRisk = 0.50;
  else if (p1.myopia || p2.myopia) myopiaRisk = 0.25;
  risks.push({
    label: 'Myopia Liability',
    affected: myopiaRisk,
    description: 'Highly heritable (~80%) but influenced by environmental ocular strain.'
  });

  // T2 Diabetes logic
  let diabetesRisk = 0.15; // Baseline
  if (p1.diabetesT2 && p2.diabetesT2) diabetesRisk = 0.70;
  else if (p1.diabetesT2 || p2.diabetesT2) diabetesRisk = 0.40;
  risks.push({
    label: 'T2 Diabetes Risk',
    affected: diabetesRisk,
    description: 'Multifactorial condition with strong polygenic liability threshold.'
  });

  // Autosomal Recessive (Thalassemia)
  const thal = calculateAutosomalRecessiveRisk(p1.thalassemia, p2.thalassemia);
  if (thal.affected > 0 || thal.carrier > 0) {
    risks.push({
      label: 'Thalassemia (HbS/HbC)',
      affected: thal.affected,
      carrier: thal.carrier,
      description: 'Autosomal recessive inheritance. Carrier screening recommended.'
    });
  }

  // X-linked (Color Blindness) - Simplified
  if (p1.colorBlindness || p2.colorBlindness) {
    const xRisk = calculateXLinkedRisk(p1.colorBlindness, p2.colorBlindness);
    risks.push({
      label: 'X-Linked Dyschromatopsia',
      affected: (xRisk.maleAffected + xRisk.femaleAffected) / 2, // Average across offspring probability
      description: 'Sex-linked recessive inheritance. Higher phenotypic expression in biological males.'
    });
  }

  return risks;
}
/**
 * Check for Rh Incompatibility Risk
 */
export function checkRhIncompatibility(mother: BloodType, father: BloodType): { isAtRisk: boolean; message: string } {
  const motherRh = mother.endsWith('-');
  const fatherRh = father.endsWith('+');

  if (motherRh && fatherRh) {
    return {
      isAtRisk: true,
      message: "Rh Incompatibility Risk detected. Rh-negative mother and Rh-positive father. Prophylaxis (e.g., RhoGAM) usually required at 28 weeks and post-delivery to prevent hemolytic disease of the newborn (HDN)."
    };
  }

  return { isAtRisk: false, message: "Standard Rh compatibility. No specific anti-D prophylaxis indicated based on current parameters." };
}

/**
 * High-Risk Pregnancy Classifier (Heuristic based on User Request specs)
 * 91% accuracy claim implies a specific model context, here modeled as a logic-gate.
 */
export function predictPregnancyRisk(data: MaternalHealthData): { riskScore: number; status: 'HIGH' | 'LOW'; notes: string[] } {
  let score = 0;
  const notes = [];

  if (data.age > 35) { score += 30; notes.push("Advanced maternal age (>35)"); }
  if (data.systolicBP > 140 || data.diastolicBP > 90) { score += 40; notes.push("Elevated Blood Pressure (Hypertension Risk)"); }
  if (data.glucoseLevel > 140) { score += 30; notes.push("Elevated Blood Glucose (Gestational Diabetes Risk)"); }

  return {
    riskScore: score,
    status: score >= 40 ? 'HIGH' : 'LOW',
    notes: notes.length > 0 ? notes : ["All parameters within observed safety ranges."]
  };
}

/**
 * Mendelian Inheritance Logic for ABO Blood Groups
 */
export function calculateBloodTypeProbabilities(p1: BloodType, p2: BloodType): TraitProbability[] {
  const getAlleles = (bt: BloodType): string[][] => {
    const type = bt.replace(/[+-]/, '');
    const rh = bt.endsWith('+') ? ['+', '-'] : ['-']; // Simplifying Rh: + can be ++ or +- (carrier), - is always --
    
    let genes: string[] = [];
    if (type === 'A') genes = ['A', 'O']; // Simplified: assuming A can be AO
    else if (type === 'B') genes = ['B', 'O'];
    else if (type === 'AB') genes = ['A', 'B'];
    else if (type === 'O') genes = ['O', 'O'];

    // For better accuracy, we'd need more genotype info, but phenotype-only implies probability
    return [genes, rh];
  };

  const [a1, r1] = getAlleles(p1);
  const [a2, r2] = getAlleles(p2);

  const outcomes: Record<string, number> = {};
  let totalCombos = 0;

  for (const g1 of a1) {
    for (const g2 of a2) {
      for (const rh1 of r1) {
        for (const rh2 of r2) {
          totalCombos++;
          const phenotype = combineGenes(g1, g2);
          const rhPhenotype = (rh1 === '+' || rh2 === '+') ? '+' : '-';
          const fullType = `${phenotype}${rhPhenotype}`;
          outcomes[fullType] = (outcomes[fullType] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(outcomes).map(([label, count]) => ({
    label,
    probability: count / totalCombos,
  })).sort((a, b) => b.probability - a.probability);
}

function combineGenes(g1: string, g2: string): string {
  if (g1 === 'O' && g2 === 'O') return 'O';
  if ((g1 === 'A' && g2 === 'B') || (g1 === 'B' && g2 === 'A')) return 'AB';
  if (g1 === 'A' || g2 === 'A') return 'A';
  if (g1 === 'B' || g2 === 'B') return 'B';
  return 'O';
}

/**
 * Simplified Mendelian Eye Color Model
 */
export function calculateEyeColorProbabilities(p1: EyeColor, p2: EyeColor): TraitProbability[] {
  // Eye color is polygenic, but the Bey2 and Gey model is a common Mendelian simplification
  // Brown > Green > Blue
  const probabilities: Record<EyeColor, number> = {
    [EyeColor.BROWN]: 0,
    [EyeColor.BLUE]: 0,
    [EyeColor.GREEN]: 0,
    [EyeColor.HAZEL]: 0,
    [EyeColor.GRAY]: 0,
  };

  if (p1 === EyeColor.BROWN && p2 === EyeColor.BROWN) {
    probabilities[EyeColor.BROWN] = 0.75;
    probabilities[EyeColor.GREEN] = 0.1875;
    probabilities[EyeColor.BLUE] = 0.0625;
  } else if (p1 === EyeColor.BLUE && p2 === EyeColor.BLUE) {
    probabilities[EyeColor.BLUE] = 0.99;
    probabilities[EyeColor.GREEN] = 0.01;
  } else if (p1 === EyeColor.GREEN && p2 === EyeColor.GREEN) {
    probabilities[EyeColor.GREEN] = 0.75;
    probabilities[EyeColor.BLUE] = 0.25;
  } else if ((p1 === EyeColor.BROWN && p2 === EyeColor.BLUE) || (p1 === EyeColor.BLUE && p2 === EyeColor.BROWN)) {
    probabilities[EyeColor.BROWN] = 0.50;
    probabilities[EyeColor.BLUE] = 0.50;
  } else {
    // Default fallback for mixed/rarer types
    probabilities[p1] = 0.45;
    probabilities[p2] = 0.45;
    probabilities[EyeColor.GREEN] = 0.10;
  }

  return Object.entries(probabilities)
    .filter(([_, prob]) => prob > 0)
    .map(([label, probability]) => ({ label, probability }))
    .sort((a, b) => b.probability - a.probability);
}
