// src/lib/geneticEngine.ts - Your implementation with fixes
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
 * Check for Rh Incompatibility Risk - Enhanced with full medical protocol
 */
// src/lib/geneticEngine.ts - FIXED Rh incompatibility detection
export function checkRhIncompatibility(mother: BloodType, father: BloodType): { 
  isAtRisk: boolean; 
  message: string;
  recommendations: string[];
  requiresRhoGAM: boolean;
} {
  // CRITICAL FIX: Properly detect Rh status
  // BloodType enum values: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  const motherIsNegative = mother.includes('-');
  const fatherIsPositive = father.includes('+');
  
  console.log(`Rh Check: Mother=${mother} (negative:${motherIsNegative}), Father=${father} (positive:${fatherIsPositive})`);
  
  // Risk exists ONLY when mother is Rh-negative AND father is Rh-positive
  const isAtRisk = motherIsNegative && fatherIsPositive;

  if (isAtRisk) {
    return {
      isAtRisk: true,
      message: `⚠️ CRITICAL: Rh Incompatibility Detected. Mother is ${mother} (Rh-negative) and Father is ${father} (Rh-positive). The mother's immune system may produce antibodies that attack an Rh-positive fetus's red blood cells, potentially causing Hemolytic Disease of the Newborn (HDN).`,
      recommendations: [
        "Rh Immune Globulin (RhoGAM) required at 28 weeks gestation",
        "Second dose required within 72 hours of delivery if baby is Rh-positive",
        "Additional doses needed after: miscarriage, abortion, ectopic pregnancy, amniocentesis, or any vaginal bleeding",
        "Monthly antibody screening (indirect Coombs test) starting at 28 weeks",
        "99% preventable with proper RhoGAM administration"
      ],
      requiresRhoGAM: true
    };
  }

  // Provide appropriate safe message
  let safeMessage = "";
  if (motherIsNegative && !fatherIsPositive) {
    safeMessage = `✓ No Rh incompatibility. Both parents are Rh-negative (Mother: ${mother}, Father: ${father}). No RhoGAM required.`;
  } else if (!motherIsNegative && fatherIsPositive) {
    safeMessage = `✓ No Rh incompatibility. Mother is Rh-positive (${mother}), can safely carry any Rh-type baby.`;
  } else if (!motherIsNegative && !fatherIsPositive) {
    safeMessage = `✓ No Rh incompatibility. Mother is Rh-positive (${mother}), Father is Rh-negative (${father}). No risk of incompatibility.`;
  } else {
    safeMessage = `✓ No Rh incompatibility detected. Standard prenatal monitoring recommended.`;
  }
  
  return { 
    isAtRisk: false, 
    message: safeMessage,
    recommendations: ["Continue routine prenatal care", "Standard blood type screening complete"],
    requiresRhoGAM: false
  };
}

/**
 * High-Risk Pregnancy Classifier (Heuristic based on User Request specs)
 * 91% accuracy claim implies a specific model context, here modeled as a logic-gate.
 */
export function predictPregnancyRisk(data: MaternalHealthData): { riskScore: number; status: 'LOW' | 'MODERATE' | 'HIGH'; notes: string[] } {
  let score = 0;
  const notes = [];

  if (data.age > 35) { 
    score += 30; 
    notes.push(`Advanced maternal age (${data.age} > 35) - Increased risk for chromosomal abnormalities`); 
  }
  if (data.age > 40) { 
    score += 20; 
    notes.push(`Advanced maternal age (${data.age} > 40) - Significantly elevated risk, detailed anomaly scan recommended`); 
  }
  
  if (data.systolicBP > 140 || data.diastolicBP > 90) { 
    score += 40; 
    notes.push(`Hypertension detected (${data.systolicBP}/${data.diastolicBP}) - Monitor for preeclampsia`); 
  } else if (data.systolicBP > 130 || data.diastolicBP > 85) { 
    score += 20; 
    notes.push(`Elevated Blood Pressure (${data.systolicBP}/${data.diastolicBP}) - Regular monitoring advised`); 
  }
  
  if (data.glucoseLevel > 140) { 
    score += 30; 
    notes.push(`Elevated Blood Glucose (${data.glucoseLevel} mg/dL > 140) - Gestational Diabetes screening required`); 
  } else if (data.glucoseLevel > 100) { 
    score += 15; 
    notes.push(`Borderline glucose (${data.glucoseLevel} mg/dL) - Consider early GDM screening`); 
  }

  let status: 'LOW' | 'MODERATE' | 'HIGH';
  if (score >= 60) status = 'HIGH';
  else if (score >= 30) status = 'MODERATE';
  else status = 'LOW';
  
  if (notes.length === 0) {
    notes.push("All parameters within observed safety ranges - Continue standard prenatal care protocol");
  }

  return {
    riskScore: score,
    status: status,
    notes: notes
  };
}

/**
 * Mendelian Inheritance Logic for ABO Blood Groups - Fixed
 */
export function calculateBloodTypeProbabilities(p1: BloodType, p2: BloodType): TraitProbability[] {
  const getAlleles = (bt: BloodType): string[] => {
    const type = bt.replace(/[+-]/, '');
    if (type === 'A') return ['A', 'O'];
    if (type === 'B') return ['B', 'O'];
    if (type === 'AB') return ['A', 'B'];
    if (type === 'O') return ['O', 'O'];
    return ['O', 'O'];
  };

  const getRhAlleles = (bt: BloodType): string[] => {
    const isPositive = bt.endsWith('+');
    // Rh+ can be ++ or +-, Rh- is always --
    if (isPositive) return ['+', '-']; // 2/3 chance of being +-, 1/3 chance of being ++
    return ['-', '-'];
  };

  const a1Genes = getAlleles(p1);
  const a2Genes = getAlleles(p2);
  const rh1Genes = getRhAlleles(p1);
  const rh2Genes = getRhAlleles(p2);

  const outcomes: Record<string, number> = {};
  let totalCombos = 0;

  for (const g1 of a1Genes) {
    for (const g2 of a2Genes) {
      for (const rh1 of rh1Genes) {
        for (const rh2 of rh2Genes) {
          totalCombos++;
          const bloodType = combineGenes(g1, g2);
          const rhType = (rh1 === '+' || rh2 === '+') ? '+' : '-';
          const fullType = `${bloodType}${rhType}`;
          outcomes[fullType] = (outcomes[fullType] || 0) + 1;
        }
      }
    }
  }

  return Object.entries(outcomes).map(([label, count]) => ({
    label: label as BloodType,
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
  } else if ((p1 === EyeColor.BROWN && p2 === EyeColor.GREEN) || (p1 === EyeColor.GREEN && p2 === EyeColor.BROWN)) {
    probabilities[EyeColor.BROWN] = 0.50;
    probabilities[EyeColor.GREEN] = 0.50;
  } else if ((p1 === EyeColor.HAZEL && p2 === EyeColor.BLUE) || (p1 === EyeColor.BLUE && p2 === EyeColor.HAZEL)) {
    probabilities[EyeColor.HAZEL] = 0.50;
    probabilities[EyeColor.BLUE] = 0.50;
  } else {
    // Default fallback for mixed/rarer types
    probabilities[p1] = 0.45;
    probabilities[p2] = 0.45;
    probabilities[EyeColor.GREEN] = 0.10;
  }

  // Clean up zero probabilities
  const result = Object.entries(probabilities)
    .filter(([_, prob]) => prob > 0)
    .map(([label, probability]) => ({ 
      label: label as EyeColor, 
      probability 
    }))
    .sort((a, b) => b.probability - a.probability);

  return result;
}