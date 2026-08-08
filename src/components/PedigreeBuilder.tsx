// src/components/PedigreeBuilder.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Plus,
  User,
  Users,
  Trash2,
  Edit,
  Save,
  X,
  GitBranch,
  RefreshCw,
  FileJson,
  Link2,
  Dna,
  UserPlus,
  Heart,
  AlertCircle,
  Info,
  Network,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize,
  Minimize,
  RotateCcw,
  Download,
  CheckCircle
} from 'lucide-react';
import brain from '../assets/custom_icons/brain.svg';
import colorBlind from '../assets/custom_icons/color-blind.svg';
import cysticFibrosis from '../assets/custom_icons/cysticFibrosis.svg';
import diabetes from '../assets/custom_icons/diabetes.svg';
import Married from '../assets/custom_icons/married-link.svg';
import myopia from '../assets/custom_icons/myopia.svg';
import sickleCell from '../assets/custom_icons/sickle-cell.svg';
import pinkribbon from '../assets/custom_icons/pinkRibbon.svg';
import violetribbon from '../assets/custom_icons/violetRibbon.svg';
import Affected from '../assets/custom_icons/affected.svg';
import Deceased from '../assets/custom_icons/deceased.svg';
import {
  PedigreeData,
  PedigreeMember,
  PedigreeRelationship,
  createDefaultPedigree,
  PEDIGREE_JSON_MAGIC,
  PEDIGREE_JSON_VERSION
} from '../types/pedigree';
import { usePedigreeStorage, validatePedigreeData } from '../utils/storage';

// ============================================================================
// 1. GENETIC ENGINE
// ============================================================================

interface GeneticRiskResult {
  trait: string;
  risk: number;
  inheritance: string;
  explanation: string;
}

class SimpleGeneticEngine {
  static calculateRisks(
    mother: PedigreeMember | null,
    father: PedigreeMember | null,
    children: PedigreeMember[]
  ): GeneticRiskResult[] {
    const results: GeneticRiskResult[] = [];

    const traits = [
      { key: 'myopia', name: 'Myopia', type: 'Autosomal Dominant' },
      { key: 'diabetes', name: 'Type 2 Diabetes', type: 'Autosomal Dominant' },
      { key: 'colorBlindness', name: 'Color Blindness', type: 'X-Linked' },
      { key: 'cysticFibrosis', name: 'Cystic Fibrosis', type: 'Autosomal Recessive' },
      { key: 'sickleCell', name: 'Sickle Cell', type: 'Autosomal Recessive' },
      { key: 'huntingtons', name: 'Huntington\'s', type: 'Autosomal Dominant' },
      { key: 'brca1', name: 'BRCA1', type: 'Autosomal Dominant' },
      { key: 'brca2', name: 'BRCA2', type: 'Autosomal Dominant' }
    ];

    for (const trait of traits) {
      const motherHas = mother ? (mother as any)[trait.key] : false;
      const fatherHas = father ? (father as any)[trait.key] : false;
      const childrenWith = children.filter(c => (c as any)[trait.key]).length;

      let risk = 0;
      let explanation = '';

      if (trait.type === 'Autosomal Dominant') {
        if (motherHas || fatherHas) {
          risk = 0.5;
          explanation = '50% chance if a parent is affected';
        } else if (childrenWith > 0) {
          risk = 0.25;
          explanation = '25% chance based on affected children';
        } else {
          risk = 0.05;
          explanation = 'Low population baseline risk';
        }
      } else if (trait.type === 'Autosomal Recessive') {
        if (motherHas && fatherHas) {
          risk = 0.75;
          explanation = '75% if both parents are affected';
        } else if (motherHas || fatherHas) {
          risk = 0.25;
          explanation = '25% if one parent is affected';
        } else if (childrenWith > 0) {
          risk = 0.25;
          explanation = '25% chance for each child';
        } else {
          risk = 0.02;
          explanation = 'Low population baseline risk';
        }
      } else if (trait.type === 'X-Linked') {
        if (motherHas) {
          risk = 0.5;
          explanation = '50% for sons if mother is affected';
        } else if (fatherHas) {
          risk = 0.5;
          explanation = '50% for daughters if father is affected';
        } else {
          risk = 0.02;
          explanation = 'Low population baseline risk';
        }
      }

      results.push({
        trait: trait.name,
        risk: Math.min(risk, 1),
        inheritance: trait.type,
        explanation
      });
    }

    return results;
  }
}

// ============================================================================
// 2. MEMBER EDIT FORM
// ============================================================================

interface MemberFormProps {
  editingMember: PedigreeMember | null;
  onUpdate: (member: PedigreeMember) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const MemberEditForm: React.FC<MemberFormProps> = ({
  editingMember,
  onUpdate,
  onDelete,
  onClose
}) => {
  if (!editingMember) return null;

  const [localMember, setLocalMember] = useState(editingMember);

  useEffect(() => {
    setLocalMember(editingMember);
  }, [editingMember]);

  const handleChange = (field: keyof PedigreeMember, value: any) => {
    setLocalMember(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(localMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#0a0a0c] border border-white/10 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-[10000]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" />
            Edit Member
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Name</label>
            <input
              type="text"
              value={localMember.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
              placeholder="Enter name"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Gender</label>
              <select
                value={localMember.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Age</label>
              <input
                type="number"
                value={localMember.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
                placeholder="Years"
                min="0"
                max="120"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={localMember.isProband || false}
                onChange={(e) => handleChange('isProband', e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              Proband
            </label>
            <label className="flex items-center gap-2 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={localMember.deceased || false}
                onChange={(e) => handleChange('deceased', e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              Deceased
            </label>
            <label className="flex items-center gap-2 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={localMember.affected || false}
                onChange={(e) => handleChange('affected', e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              Affected
            </label>
            <label className="flex items-center gap-2 text-[10px] text-white/60 font-mono">
              <input
                type="checkbox"
                checked={localMember.carrier || false}
                onChange={(e) => handleChange('carrier', e.target.checked)}
                className="w-4 h-4 accent-emerald-500"
              />
              Carrier
            </label>
          </div>

          <div className="border-t border-white/10 pt-3">
            <label className="block text-[10px] text-white/40 uppercase font-mono mb-2">Genetic Conditions</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'myopia', label: 'Myopia' },
                { key: 'diabetes', label: 'Diabetes' },
                { key: 'colorBlindness', label: 'Color Blindness' },
                { key: 'cysticFibrosis', label: 'Cystic Fibrosis' },
                { key: 'sickleCell', label: 'Sickle Cell' },
                { key: 'huntingtons', label: "Huntington's" },
                { key: 'brca1', label: 'BRCA1' },
                { key: 'brca2', label: 'BRCA2' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-[10px] text-white/60 font-mono">
                  <input
                    type="checkbox"
                    checked={(localMember as any)[key] || false}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Notes</label>
            <textarea
              value={localMember.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none resize-none"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
            <Save className="w-3 h-3" />
            Save
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this member and all their relationships?')) {
                onDelete(localMember.id);
                onClose();
              }
            }}
            className="py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs transition-all flex items-center gap-2"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. MAIN PEDIGREE BUILDER WITH RECOVERY MECHANISM
// ============================================================================

interface PedigreeBuilderProps {
  data?: PedigreeData;
  onSave?: (data: PedigreeData) => void;
  onMemberSelect?: (member: PedigreeMember) => void;
  onDataChange?: (data: PedigreeData) => void;
}

export const PedigreeBuilder: React.FC<PedigreeBuilderProps> = ({
  data: initialData,
  onSave,
  onMemberSelect,
  onDataChange
}) => {
  // Use the safe storage hook with recovery mechanism
  const {
    data: storageData,
    setData: setStorageData,
    resetToDefault,
    validationErrors,
    isValid
  } = usePedigreeStorage('pedigree_data');

  // Local state with recovery from storage
  const [pedigreeData, setPedigreeData] = useState<PedigreeData>(
    initialData || storageData || createDefaultPedigree()
  );

  const [selectedMember, setSelectedMember] = useState<PedigreeMember | null>(null);
  const [editingMember, setEditingMember] = useState<PedigreeMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Recovery state
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  // Drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // 4. VALIDATION & RECOVERY
  // ==========================================================================

  // Check for validation errors on mount and when data changes
  useEffect(() => {
    if (!isValid && validationErrors.length > 0) {
      setShowRecoveryBanner(true);
      setRecoveryMessage(
        `⚠️ Data validation failed: ${validationErrors.join(', ')}. 
        Your pedigree data may be corrupted. You can reset to default or try to recover.`
      );
      console.error('Pedigree data validation errors:', validationErrors);
    } else {
      setShowRecoveryBanner(false);
      setRecoveryMessage(null);
    }
  }, [isValid, validationErrors]);

  // Sync with storage when data changes
  useEffect(() => {
    if (pedigreeData && isValid) {
      setStorageData(pedigreeData);
    }
  }, [pedigreeData, isValid, setStorageData]);

  // ==========================================================================
  // 5. DATA OPERATIONS
  // ==========================================================================

  const updateData = useCallback((newData: PedigreeData) => {
    setPedigreeData(newData);
    setStorageData(newData);
    if (onDataChange) onDataChange(newData);
    if (onSave) onSave(newData);
  }, [onDataChange, onSave, setStorageData]);

  const addMember = useCallback((position?: { x: number; y: number }) => {
    const count = pedigreeData.members.length;
    const isParent = count < 2;
    const defaultPos = position || {
      x: 100 + (count % 2) * 200 + Math.random() * 50,
      y: isParent ? 100 : 300 + Math.random() * 100
    };

    const newMember: PedigreeMember = {
      id: `m${Date.now()}`,
      name: isParent ? `Parent ${count + 1}` : `Child ${count - 1}`,
      gender: count % 2 === 0 ? 'FEMALE' : 'MALE',
      position: defaultPos,
      affected: false,
      carrier: false,
      myopia: false,
      diabetes: false,
      colorBlindness: false,
      cysticFibrosis: false,
      sickleCell: false,
      huntingtons: false,
      brca1: false,
      brca2: false,
      isProband: count === 2,
      deceased: false
    };

    updateData({
      ...pedigreeData,
      members: [...pedigreeData.members, newMember],
      metadata: {
        ...pedigreeData.metadata,
        updatedAt: new Date().toISOString()
      }
    });

    setSelectedMember(newMember);
    setEditingMember(newMember);
    setShowMemberModal(true);
  }, [pedigreeData, updateData]);

  const deleteMember = useCallback((memberId: string) => {
    if (!window.confirm('Delete this member and all their relationships?')) return;

    updateData({
      ...pedigreeData,
      members: pedigreeData.members.filter(m => m.id !== memberId),
      relationships: pedigreeData.relationships.filter(
        r => r.sourceId !== memberId && r.targetId !== memberId
      ),
      metadata: {
        ...pedigreeData.metadata,
        updatedAt: new Date().toISOString()
      }
    });
    setSelectedMember(null);
  }, [pedigreeData, updateData]);

  const updateMember = useCallback((member: PedigreeMember) => {
    updateData({
      ...pedigreeData,
      members: pedigreeData.members.map(m => m.id === member.id ? member : m),
      metadata: {
        ...pedigreeData.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  }, [pedigreeData, updateData]);

  const addRelationship = useCallback((
    type: 'MARRIAGE' | 'PARENT_CHILD',
    sourceId: string,
    targetId: string
  ) => {
    const exists = pedigreeData.relationships.some(
      r => (r.sourceId === sourceId && r.targetId === targetId) ||
        (r.sourceId === targetId && r.targetId === sourceId)
    );
    if (exists) return;

    const relationship: PedigreeRelationship = {
      id: `r${Date.now()}`,
      type,
      sourceId,
      targetId
    };

    updateData({
      ...pedigreeData,
      relationships: [...pedigreeData.relationships, relationship],
      metadata: {
        ...pedigreeData.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  }, [pedigreeData, updateData]);

  const setProband = useCallback((memberId: string) => {
    updateData({
      ...pedigreeData,
      members: pedigreeData.members.map(m => ({
        ...m,
        isProband: m.id === memberId
      })),
      metadata: {
        ...pedigreeData.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  }, [pedigreeData, updateData]);

  // Reset to default handler
  const handleResetToDefault = useCallback(() => {
    if (window.confirm('⚠️ This will reset your pedigree to default. All unsaved changes will be lost. Are you sure?')) {
      resetToDefault();
      setShowRecoveryBanner(false);
      setRecoveryMessage(null);
      // Force refresh the local state
      setPedigreeData(createDefaultPedigree());
      setSelectedMember(null);
    }
  }, [resetToDefault]);

  // ==========================================================================
  // 6. DRAG AND DROP
  // ==========================================================================
  // NOTE: React attaches touchstart/touchmove listeners as PASSIVE by default,
  // so calling e.preventDefault() inside those handlers throws
  // "Unable to preventDefault inside passive event listener invocation"
  // on every frame. We rely on `touchAction: 'none'` (set on the draggable
  // node below) to stop the browser from scrolling while dragging instead
  // of calling preventDefault() from touch handlers.

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, memberId: string) => {
    const isTouch = 'touches' in e;
    if (!isTouch) {
      // Safe to preventDefault on mouse events (non-passive by default)
      e.preventDefault();
    }
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    const member = pedigreeData.members.find(m => m.id === memberId);
    if (!member) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingId(memberId);
    setDragOffset({
      x: clientX - rect.left - member.position.x * zoomLevel,
      y: clientY - rect.top - member.position.y * zoomLevel
    });
  }, [pedigreeData.members, zoomLevel]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingId || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - dragOffset.x) / zoomLevel;
    const y = (clientY - rect.top - dragOffset.y) / zoomLevel;

    const updatedMembers = pedigreeData.members.map(m => {
      if (m.id === draggingId) {
        return {
          ...m,
          position: {
            x: Math.max(0, Math.min(x, 800)),
            y: Math.max(0, Math.min(y, 600))
          }
        };
      }
      return m;
    });

    updateData({
      ...pedigreeData,
      members: updatedMembers,
      metadata: {
        ...pedigreeData.metadata,
        updatedAt: new Date().toISOString()
      }
    });
    // No preventDefault() here for touch events — see note above.
  }, [draggingId, dragOffset, pedigreeData, updateData, zoomLevel]);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, memberId: string) => {
    handleDragStart(e, memberId);
  }, [handleDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingId) {
      handleDragMove(e);
    }
  }, [draggingId, handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const memberElement = target?.closest('[data-member-id]');

    if (memberElement) {
      const memberId = memberElement.getAttribute('data-member-id');
      if (memberId) {
        handleDragStart(e, memberId);
      }
    }
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (draggingId) {
      handleDragMove(e);
    }
    // No preventDefault() here — the passive touchmove listener can't call
    // it anyway (that's what was spamming the console), and touchAction:
    // 'none' on the dragged node already stops the page from scrolling.
  }, [draggingId, handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // ==========================================================================
  // 7. ZOOM CONTROLS
  // ==========================================================================

  const zoomIn = useCallback(() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5)), []);
  const zoomOut = useCallback(() => setZoomLevel(prev => Math.max(prev - 0.2, 0.4)), []);
  const resetView = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // ==========================================================================
  // 8. HELPER FUNCTIONS
  // ==========================================================================

  const getParents = useCallback((memberId: string) => {
    const parentRels = pedigreeData.relationships.filter(
      r => r.type === 'PARENT_CHILD' && r.targetId === memberId
    );
    return parentRels.map(r =>
      pedigreeData.members.find(m => m.id === r.sourceId)
    ).filter(Boolean) as PedigreeMember[];
  }, [pedigreeData]);

  const getChildren = useCallback((memberId: string) => {
    const childRels = pedigreeData.relationships.filter(
      r => r.type === 'PARENT_CHILD' && r.sourceId === memberId
    );
    return childRels.map(r =>
      pedigreeData.members.find(m => m.id === r.targetId)
    ).filter(Boolean) as PedigreeMember[];
  }, [pedigreeData]);

  const getSpouse = useCallback((memberId: string) => {
    const spouseRels = pedigreeData.relationships.filter(
      r => r.type === 'MARRIAGE' && (r.sourceId === memberId || r.targetId === memberId)
    );
    if (spouseRels.length === 0) return null;
    const rel = spouseRels[0];
    const spouseId = rel.sourceId === memberId ? rel.targetId : rel.sourceId;
    return pedigreeData.members.find(m => m.id === spouseId) || null;
  }, [pedigreeData]);

  const getMemberRelationships = useCallback((memberId: string) => {
    return pedigreeData.relationships.filter(
      r => r.sourceId === memberId || r.targetId === memberId
    );
  }, [pedigreeData]);

  const renderGenderIcon = (gender: string, size: number = 44) => {
    const colors = {
      MALE: { bg: '#1a2a3a', stroke: '#4ade80' },
      FEMALE: { bg: '#2a1a3a', stroke: '#f472b6' },
      UNKNOWN: { bg: '#1a1a2a', stroke: '#94a3b8' }
    };
    const color = colors[gender as keyof typeof colors] || colors.UNKNOWN;

    return (
      <svg width={size} height={size} viewBox="0 0 50 50">
        {gender === 'MALE' ? (
          <rect x="5" y="5" width="40" height="40" rx="4" fill={color.bg} stroke={color.stroke} strokeWidth="2" />
        ) : gender === 'FEMALE' ? (
          <circle cx="25" cy="25" r="20" fill={color.bg} stroke={color.stroke} strokeWidth="2" />
        ) : (
          <polygon points="25,5 45,25 25,45 5,25" fill={color.bg} stroke={color.stroke} strokeWidth="2" />
        )}
        <text x="25" y="32" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">
          {gender === 'MALE' ? '♂' : gender === 'FEMALE' ? '♀' : '⚧'}
        </text>
      </svg>
    );
  };

  // ==========================================================================
  // 9. MODALS
  // ==========================================================================

  const RelationshipModal: React.FC = () => {
    const [selectedSource, setSelectedSource] = useState('');
    const [selectedTarget, setSelectedTarget] = useState('');
    const [relationshipType, setRelationshipType] = useState<'PARENT_CHILD' | 'MARRIAGE'>('PARENT_CHILD');

    const memberOptions = pedigreeData.members.map(m => ({
      value: m.id,
      label: `${m.name} (${m.gender})`
    }));

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#0a0a0c] border border-white/10 p-6 w-full max-w-md relative z-[10000]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-500" />
              Add Relationship
            </h3>
            <button onClick={() => setShowRelationshipModal(false)} className="text-white/40 hover:text-white/80 transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Relationship Type</label>
              <select
                value={relationshipType}
                onChange={(e) => setRelationshipType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
              >
                <option value="PARENT_CHILD">Parent → Child</option>
                <option value="MARRIAGE">Marriage</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
              >
                <option value="">Select source...</option>
                {memberOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Target</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
              >
                <option value="">Select target...</option>
                {memberOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                if (selectedSource && selectedTarget) {
                  addRelationship(relationshipType, selectedSource, selectedTarget);
                  setShowRelationshipModal(false);
                }
              }}
              disabled={!selectedSource || !selectedTarget}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Link2 className="w-3 h-3" />
              Add Relationship
            </button>
            <button onClick={() => setShowRelationshipModal(false)} className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/40 font-mono text-xs transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RiskModal: React.FC = () => {
    const proband = pedigreeData.members.find(m => m.isProband);
    const parents = proband ? getParents(proband.id) : [];
    const mother = parents.find(p => p.gender === 'FEMALE') || null;
    const father = parents.find(p => p.gender === 'MALE') || null;
    const children = proband ? getChildren(proband.id) : [];

    const risks = SimpleGeneticEngine.calculateRisks(mother, father, children);

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#0a0a0c] border border-white/10 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-[10000]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
              <Dna className="w-4 h-4 text-emerald-500" />
              Genetic Risk Assessment
            </h3>
            <button onClick={() => setShowRiskModal(false)} className="text-white/40 hover:text-white/80 transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!proband ? (
            <div className="text-center py-8 text-white/40">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-400" />
              <p className="text-sm font-mono">No proband selected. Click "Set Proband" on a member.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4 text-[10px] text-white/40">
                <div className="border border-white/10 p-2 text-center">
                  <span className="block text-[8px] uppercase">Proband</span>
                  <span className="text-white/80 text-sm">{proband.name}</span>
                </div>
                <div className="border border-white/10 p-2 text-center">
                  <span className="block text-[8px] uppercase">Mother</span>
                  <span className="text-white/80 text-sm">{mother?.name || 'Unknown'}</span>
                </div>
                <div className="border border-white/10 p-2 text-center">
                  <span className="block text-[8px] uppercase">Father</span>
                  <span className="text-white/80 text-sm">{father?.name || 'Unknown'}</span>
                </div>
              </div>

              <div className="space-y-2">
                {risks.map((risk, idx) => (
                  <div key={idx} className="border border-white/10 p-3 bg-white/5 flex justify-between items-center hover:border-emerald-500/30 transition-all">
                    <div>
                      <div className="text-xs font-mono text-white/80">{risk.trait}</div>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{risk.inheritance}</span>
                      </div>
                      <div className="text-[8px] text-white/30 mt-0.5">{risk.explanation}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-light text-white">{(risk.risk * 100).toFixed(1)}%</div>
                      <div className="text-[8px] text-white/30">Risk</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const ExportModal: React.FC = () => {
    const [fileName, setFileName] = useState('pedigree.json');
    const [importError, setImportError] = useState<string | null>(null);
    const [importSuccess, setImportSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const exportData = () => {
      // Ensure the data has the required fields before export
      const exportData = {
        ...pedigreeData,
        _type: PEDIGREE_JSON_MAGIC,
        _version: PEDIGREE_JSON_VERSION,
        _generatedAt: new Date().toISOString(),
        _schema: 'https://genetix.dev/schemas/pedigree-v1.json',
        metadata: {
          ...pedigreeData.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setShowExportModal(false);
      setImportError(null);
      setImportSuccess(false);
    };

    const importData = (file: File) => {
      setImportError(null);
      setImportSuccess(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rawData = JSON.parse(e.target?.result as string);

          // Validate the imported data
          const validation = validatePedigreeData(rawData);

          if (!validation.isValid) {
            setImportError(`Invalid pedigree file:\n${validation.errors.join('\n')}`);
            return;
          }

          // Update with validated data
          updateData(rawData as PedigreeData);
          setImportSuccess(true);
          setImportError(null);

          // Auto-close after success
          setTimeout(() => {
            setShowExportModal(false);
            setImportSuccess(false);
          }, 2000);

          alert('✅ Pedigree imported successfully!');
        } catch (error) {
          setImportError(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
          console.error('Import error:', error);
        }
      };

      reader.onerror = () => {
        setImportError('Failed to read file');
      };

      reader.readAsText(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div className="bg-[#0a0a0c] border border-white/10 p-6 w-full max-w-md relative z-[10000]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-white/80 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-emerald-500" />
              Import / Export
            </h3>
            <button onClick={() => {
              setShowExportModal(false);
              setImportError(null);
              setImportSuccess(false);
            }} className="text-white/40 hover:text-white/80 transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {importError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-400 whitespace-pre-wrap">{importError}</div>
              </div>
              <button
                onClick={() => {
                  setImportError(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="mt-2 text-xs text-red-400/60 hover:text-red-400 font-mono underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {importSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">Imported successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-1">Filename</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-emerald-500 outline-none"
                placeholder="pedigree.json"
              />
            </div>

            <button
              onClick={exportData}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-3 h-3" />
              Download JSON
            </button>

            <div className="border-t border-white/10 pt-4">
              <label className="block text-[10px] text-white/40 uppercase font-mono mb-2">Import JSON File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importData(file);
                }}
                className="w-full text-[10px] text-white/40 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-emerald-500/10 file:text-emerald-400 file:text-xs file:font-mono hover:file:bg-emerald-500/20 transition-all cursor-pointer"
              />
              <p className="text-[8px] text-white/20 mt-2 font-mono">
                Only valid Genetix pedigree files (.json) are accepted
              </p>
            </div>

            {/* Reset button - emergency recovery */}
            <div className="border-t border-white/10 pt-4">
              <button
                onClick={handleResetToDefault}
                className="w-full py-2 text-[10px] text-red-400/60 hover:text-red-400 font-mono transition-all border border-red-500/20 hover:border-red-500/40 rounded"
              >
                🔄 Reset to Default Pedigree
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // 10. RENDER
  // ==========================================================================

  return (
    <div className="space-y-4 relative">
      {/* Recovery Banner */}
      {showRecoveryBanner && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#0a0a0c] border border-red-500/30 p-6 w-full max-w-md relative z-[10000]">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-mono text-white/80">Data Recovery Required</h3>
                <p className="text-[10px] text-white/40 mt-1 whitespace-pre-wrap">{recoveryMessage}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRecoveryBanner(false);
                  // Force reload from storage
                  const defaultData = createDefaultPedigree();
                  setPedigreeData(defaultData);
                  setStorageData(defaultData);
                }}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0c] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3 h-3" />
                Reset & Continue
              </button>
              <button
                onClick={() => setShowRecoveryBanner(false)}
                className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/40 font-mono text-xs transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 md:p-3 border border-white/10 bg-mist-800 sticky top-[80px] md:top-[60px] z-20">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] text-white/40 uppercase font-mono hidden xs:inline">Pedigree</span>
          <span className="text-[12px] text-emerald-500/60 bg-emerald-500/10 font-semibold px-2 py-0.5 rounded whitespace-nowrap">
            {pedigreeData.members.length} members
          </span>
          {!isValid && (
            <span className="text-[8px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded whitespace-nowrap">
              ⚠️ Data Error
            </span>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap gap-1.5">
          <button onClick={zoomOut} className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all rounded" title="Zoom Out">
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-white/40 font-mono flex items-center min-w-[40px] justify-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button onClick={zoomIn} className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all rounded" title="Zoom In">
            <ZoomIn className="w-3 h-3" />
          </button>
          <button onClick={resetView} className="p-1.5 bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all rounded" title="Reset View">
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className="w-px h-6 bg-white/10 hidden sm:block" />

          <button
            onClick={() => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) {
                addMember({
                  x: rect.width / 2 - 25 + (pedigreeData.members.length % 2) * 180,
                  y: pedigreeData.members.length < 2 ? 120 : 340
                });
              }
            }}
            className="px-2 md:px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] md:text-xs font-mono hover:bg-emerald-500/20 transition-all flex items-center gap-1"
          >
            <UserPlus className="w-3 h-3" />
            <span className="hidden xs:inline">Add</span>
          </button>

          <button onClick={() => setShowRelationshipModal(true)} className="px-2 md:px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] md:text-xs font-mono hover:bg-blue-500/20 transition-all flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            <span className="hidden sm:inline">Link</span>
          </button>

          <button onClick={() => setShowRiskModal(true)} className="px-2 md:px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] md:text-xs font-mono hover:bg-purple-500/20 transition-all flex items-center gap-1">
            <Dna className="w-3 h-3" />
            <span className="hidden sm:inline">Risks</span>
          </button>

          <button onClick={() => setShowExportModal(true)} className="px-2 md:px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 text-[10px] md:text-xs font-mono hover:bg-white/10 transition-all flex items-center gap-1">
            <FileJson className="w-3 h-3" />
            <span className="hidden sm:inline">Import/Export</span>
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[400px] md:h-[500px] lg:h-[600px] border border-white/10 bg-[#0a0a0c] relative overflow-auto touch-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {/* Grid - Now behind everything */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)',
          backgroundSize: `${40 * zoomLevel}px ${40 * zoomLevel}px`,
          zIndex: 0
        }} />

        {/* Canvas Content - Wrapped in a scrollable container */}
        <div
          className="relative"
          style={{
            width: `${Math.max(800, pedigreeData.members.length * 120)}px`,
            height: `${Math.max(600, pedigreeData.members.length * 80)}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: '0 0',
            zIndex: 1
          }}
        >
          {/* Relationship Lines - Behind members */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 1 }}>
            {pedigreeData.relationships.map(rel => {
              const source = pedigreeData.members.find(m => m.id === rel.sourceId);
              const target = pedigreeData.members.find(m => m.id === rel.targetId);
              if (!source || !target) return null;

              const x1 = source.position.x + 30;
              const y1 = source.position.y + 30;
              const x2 = target.position.x + 30;
              const y2 = target.position.y + 30;

              let path = '';
              let color = '#94a3b8';
              let dash = 'none';

              if (rel.type === 'MARRIAGE') {
                path = `M ${x1} ${y1} L ${x2} ${y2}`;
                color = '#00fef6';
                dash = '6,4';
              } else if (rel.type === 'PARENT_CHILD') {
                const midY = (y1 + y2) / 2;
                path = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;
                color = '#94a3b8';
                dash = '2,2';
              }

              return (
                <path
                  key={rel.id}
                  d={path}
                  stroke={color}
                  strokeWidth="2.5"
                  strokeDasharray={dash}
                  opacity="0.8"
                  className="pointer-events-none"
                />
              );
            })}
          </svg>

          {/* Members - On top of lines */}
          {pedigreeData.members.map(member => {
            const isSelected = selectedMember?.id === member.id;
            const isParent = getChildren(member.id).length > 0;
            const isChild = getParents(member.id).length > 0;
            const spouse = getSpouse(member.id);

            return (
              <div
                key={member.id}
                data-member-id={member.id}
                style={{
                  position: 'absolute',
                  left: member.position.x,
                  top: member.position.y,
                  cursor: 'grab',
                  zIndex: isSelected ? 10 : 2,
                  touchAction: 'none'
                }}
                className="select-none"
              >
                <div
                  className={`relative w-[60px] transition-transform ${isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  onMouseDown={(e) => handleMouseDown(e, member.id)}
                  onClick={() => {
                    setSelectedMember(member);
                    if (onMemberSelect) onMemberSelect(member);
                  }}
                  onDoubleClick={() => {
                    setEditingMember(member);
                    setShowMemberModal(true);
                  }}
                >
                  {/* Gender Shape */}
                  <div className="relative">
                    {renderGenderIcon(member.gender)}

                    {/* Trait Icons */}
                    <div className="absolute -top-2 -right-4 grid grid-rows-4 grid-cols-2 grid-flow-col gap-0.5 text-xs leading-none">
                      {member.myopia && (
                        <img
                          src={myopia}
                          alt="Myopia"
                          title="Myopia"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.diabetes && (
                        <img
                          src={diabetes}
                          alt="Diabetes"
                          title="Diabetes"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.colorBlindness && (
                        <img
                          src={colorBlind}
                          alt="Color Blindness"
                          title="Color Blindness"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.cysticFibrosis && (
                        <img
                          src={cysticFibrosis}
                          alt="Cystic Fibrosis"
                          title="Cystic Fibrosis"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.sickleCell && (
                        <img
                          src={sickleCell}
                          alt="Sickle Cell"
                          title="Sickle Cell"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.huntingtons && (
                        <img
                          src={brain}
                          alt="Huntington's"
                          title="Huntington's"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.brca1 && (
                        <img
                          src={pinkribbon}
                          alt="BRCA1"
                          title="BRCA1"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                      {member.brca2 && (
                        <img
                          src={violetribbon}
                          alt="BRCA2"
                          title="BRCA2"
                          className="w-3 h-3 object-contain"
                        />
                      )}
                    </div>

                    {/* Role Badge */}
                    {isParent && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] text-emerald-400/60 bg-emerald-500/20 px-1.5 py-0.5 rounded whitespace-nowrap">
                        Parent
                      </div>
                    )}
                    {isChild && !isParent && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] text-blue-400/60 bg-blue-500/20 px-1.5 py-0.5 rounded whitespace-nowrap">
                        Child
                      </div>
                    )}

                    {/* Status Indicators */}
                    <div className="absolute -bottom-1 right-10 flex -translate-x-1/2 gap-0.5">
                      {member.affected && (
                        <div className="w-3 h-3 bg-red/20 rounded-full">
                          <img src={Affected} className='w-full h-full object-contain' alt='Affected' />
                        </div>
                      )}
                      {member.carrier && !member.affected && (
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      )}
                      {member.deceased && (
                        <div className="w-3 h-3 bg-white/20 rounded-full">
                          <img src={Deceased} className='w-full h-full object-contain' alt='Deceased' />
                        </div>
                      )}
                    </div>

                    <div className='absolute flex -left-4 top-1/4 -translate-y-1/2 gap-0.5'>
                      {/* Spouse Indicator */}
                      {spouse && (
                        <div className="text-[8px] text-emerald-400/30">
                          <img src={Married} className='w-3 h-3' alt='Married' />
                        </div>
                      )}
                      {/* Proband Badge */}
                      {member.isProband && (
                        <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[7px] font-bold text-black border border-amber-500 shadow-lg">
                          P
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="absolute -bottom-5 right-7 text-center flex gap-1 mt-1">
                    <div className="text-[7px] text-white/60 font-mono truncate max-w-[50px]">
                      {member.name || 'Unknown'}
                    </div>
                    {member.age && (
                      <div className="text-[7px] text-white/40 bg-slate-500/20 rounded px-1 font-mono">{member.age}y</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {pedigreeData.members.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <div className="text-center">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-mono">Click "Add" to start building your pedigree</p>
                <p className="text-[10px] mt-1">Add parents first, then children</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Member Panel */}
      {selectedMember && (
        <div className="p-3 border border-white/10 bg-white/5 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-white/80">{selectedMember.name}</span>
              <span className="text-[10px] text-white/40 font-mono">{selectedMember.gender}</span>

              {selectedMember.isProband && (
                <span className="text-[8px] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">Proband</span>
              )}

              {selectedMember.affected && (
                <span className="text-[8px] text-red-400 border border-red-500/30 px-2 py-0.5 rounded">Affected</span>
              )}
              {selectedMember.carrier && !selectedMember.affected && (
                <span className="text-[8px] text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">Carrier</span>
              )}
              {selectedMember.deceased && (
                <span className="text-[8px] text-white/40 border border-white/20 px-2 py-0.5 rounded">Deceased</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setProband(selectedMember.id)}
                className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono hover:bg-amber-500/20 transition-all"
              >
                Set Proband
              </button>
              <button
                onClick={() => {
                  setEditingMember(selectedMember);
                  setShowMemberModal(true);
                }}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-mono transition-all"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-[8px] text-white/30 font-mono">
            <span>👨‍👩‍👦 Parents: {getParents(selectedMember.id).length}</span>
            <span>👨‍👧‍👦 Children: {getChildren(selectedMember.id).length}</span>
            <span>💑 Spouse: {getSpouse(selectedMember.id)?.name || 'None'}</span>
            <span>🔗 Relationships: {getMemberRelationships(selectedMember.id).length}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      {showMemberModal && (
        <MemberEditForm
          editingMember={editingMember}
          onUpdate={updateMember}
          onDelete={deleteMember}
          onClose={() => setShowMemberModal(false)}
        />
      )}
      {showRelationshipModal && <RelationshipModal />}
      {showRiskModal && <RiskModal />}
      {showExportModal && <ExportModal />}
    </div>
  );
};

export default PedigreeBuilder;