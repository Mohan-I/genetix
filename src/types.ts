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
  affected: number;
  carrier?: number;
  description: string;
}

export interface MaternalHealthData {
  age: number;
  systolicBP: number;
  diastolicBP: number;
  glucoseLevel: number;
}

export interface ParentProfile {
  name: string;
  bloodType: BloodType;
  eyeColor: EyeColor;
  hairTexture: HairTexture;
  heightCm: number;
  skinTone: string;
  thalassemia: PathologyStatus;
  colorBlindness: boolean;
  myopia: boolean;
  diabetesT2: boolean;
  maternalHealth?: MaternalHealthData;
}

export interface TraitProbability {
  label: string;
  probability: number;
}