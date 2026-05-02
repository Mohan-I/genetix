export enum BloodType {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export enum EyeColor {
  BROWN = 'Brown',
  BLUE = 'Blue',
  GREEN = 'Green',
  HAZEL = 'Hazel',
  GRAY = 'Gray',
}

export enum HairTexture {
  STRAIGHT = 'Straight',
  WAVY = 'Wavy',
  CURLY = 'Curly',
  COILY = 'Coily',
}

export enum PathologyStatus {
  NONE = 'None',
  CARRIER = 'Carrier',
  AFFECTED = 'Affected',
}

export interface PathologyRisk {
  label: string;
  affected: number; // 0-1
  carrier?: number; // 0-1
  description: string;
}

export interface ParentProfile {
  name: string;
  bloodType: BloodType;
  eyeColor: EyeColor;
  hairTexture: HairTexture;
  heightCm: number;
  skinTone: string;
  // Pathologies
  thalassemia: PathologyStatus;
  colorBlindness: boolean; // Simplified X-linked
  myopia: boolean;
  diabetesT2: boolean;
}

export interface TraitProbability {
  label: string;
  probability: number; // 0 to 1
}

export interface OffspringPrediction {
  bloodTypeProbabilities: TraitProbability[];
  eyeColorProbabilities: TraitProbability[];
  analysis: string;
}
