// src/types/pedigree.ts
export const PEDIGREE_JSON_MAGIC = 'GENETIX_PEDIGREE_V1';
export const PEDIGREE_JSON_VERSION = '1.0.0';

export interface PedigreeData {
  // Unique identifier to validate this is a Genetix pedigree file
  _type: 'GENETIX_PEDIGREE_V1';
  _version: string;
  _generatedAt: string;
  _schema: string;
  
  members: PedigreeMember[];
  relationships: PedigreeRelationship[];
  metadata: {
    familyName: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
  };
}

export interface PedigreeMember {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  position: { x: number; y: number };
  affected?: boolean;
  carrier?: boolean;
  myopia?: boolean;
  diabetes?: boolean;
  colorBlindness?: boolean;
  cysticFibrosis?: boolean;
  sickleCell?: boolean;
  huntingtons?: boolean;
  brca1?: boolean;
  brca2?: boolean;
  isProband?: boolean;
  deceased?: boolean;
  age?: number;
  notes?: string;
}

export interface PedigreeRelationship {
  id: string;
  type: 'MARRIAGE' | 'PARENT_CHILD' | 'SIBLING';
  sourceId: string;
  targetId: string;
}

export const createDefaultPedigree = (): PedigreeData => ({
  _type: PEDIGREE_JSON_MAGIC,
  _version: PEDIGREE_JSON_VERSION,
  _generatedAt: new Date().toISOString(),
  _schema: 'https://genetix.dev/schemas/pedigree-v1.json',
  members: [
    {
      id: 'p1',
      name: 'Grandfather',
      gender: 'MALE',
      position: { x: 200, y: 50 },
      myopia: false,
      diabetes: false
    },
    {
      id: 'p2',
      name: 'Grandmother',
      gender: 'FEMALE',
      position: { x: 350, y: 50 },
      myopia: false,
      diabetes: false
    },
    {
      id: 'p3',
      name: 'Mother',
      gender: 'FEMALE',
      position: { x: 275, y: 150 },
      myopia: false,
      diabetes: false
    },
    {
      id: 'p4',
      name: 'Father',
      gender: 'MALE',
      position: { x: 450, y: 150 },
      myopia: false,
      diabetes: false
    },
    {
      id: 'p5',
      name: 'Proband',
      gender: 'FEMALE',
      position: { x: 350, y: 250 },
      myopia: false,
      diabetes: false,
      isProband: true
    }
  ],
  relationships: [
    { id: 'r1', type: 'MARRIAGE', sourceId: 'p1', targetId: 'p2' },
    { id: 'r2', type: 'MARRIAGE', sourceId: 'p3', targetId: 'p4' },
    { id: 'r3', type: 'PARENT_CHILD', sourceId: 'p1', targetId: 'p3' },
    { id: 'r4', type: 'PARENT_CHILD', sourceId: 'p2', targetId: 'p3' },
    { id: 'r5', type: 'PARENT_CHILD', sourceId: 'p3', targetId: 'p5' },
    { id: 'r6', type: 'PARENT_CHILD', sourceId: 'p4', targetId: 'p5' }
  ],
  metadata: {
    familyName: 'My Family',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
});