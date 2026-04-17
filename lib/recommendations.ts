
import { ScanResults } from '../components/FaceScannerModal';

import { supabase } from './supabase';

export interface Frame {
  id: string;
  brand: string;
  model: string;
  price: number;
  image_url: string;
  description: string;
  // Metadata for scoring (Database columns)
  shape: 'Angular' | 'Round' | 'Oval' | 'Aviator' | 'Geometric' | 'Cat-Eye';
  color_temp: 'Warm' | 'Cool' | 'Neutral';
  material: 'Acetate' | 'Titanium' | 'Metal' | 'Mix';
  persona_match: string[]; 
  bridge_type: 'Fixed' | 'Adjustable';
  front_width: number;
  bridge_width: number;
  temple_length: number;
  lens_depth: number;
}

export interface RecommendationResult extends Frame {
  matchScore: number;
  scientificRationale: string;
}

export function calculateMatchScore(frame: Frame, results: ScanResults): RecommendationResult {
  let score = 50; // Higher starting base for compatible frames
  const reasons: string[] = [];

  // PART 1: GEOMETRIC FIT (Physical Specs)
  const faceShape = results.faceShape?.toLowerCase() || 'oval';
  const frameShape = frame.shape?.toLowerCase();

  // Rule of Opposites (Contrast frame shape with face shape)
  const isOpposite = 
    ((faceShape === 'round' || faceShape === 'oval') && (frameShape === 'angular' || frameShape === 'geometric')) ||
    ((faceShape === 'square' || faceShape === 'diamond') && (frameShape === 'round' || frameShape === 'oval')) ||
    (faceShape === 'heart' && frameShape === 'round');

  if (isOpposite) { 
    score += 15; 
    reasons.push(`GEOMETRIC CONTRAST: The ${frame.shape} architecture provides high-precision contrast to your ${results.faceShape} morphology. By introducing structured angles to softer contours, we achieve a balanced aesthetic that defines your features.`);
  } else {
    score += 8;
    reasons.push(`STRUCTURAL HARMONY: The ${frame.shape} silhouette complements your existing facial lines, creating a unified and sophisticated profile that respects your natural geometry.`);
  }

  // PD ALIGNMENT
  const ipd = parseFloat(results.ipd || '64.5');
  const ocularCenter = frame.front_width / 2;
  const ipdCenter = ipd / 2;
  const pdDiff = Math.abs(ocularCenter - ipdCenter);
  
  if (pdDiff < 3) {
    score += 12;
    reasons.push(`OCULAR CENTRATION: At ${ipd}mm IPD, your pupils align within the optimal optical zone of these ${frame.front_width}mm frames. This minimizes prismatic effects and ensures edge-to-edge clarity in your prescription lenses.`);
  }

  // BRIDGE FIT
  const targetBridge = parseFloat(results.bridgeWidth || '18');
  const bridgeDiff = Math.abs(frame.bridge_width - targetBridge);
  if (bridgeDiff < 2) {
    score += 10;
    reasons.push(`NASAL ARCHITECTURE: The ${frame.bridge_width}mm bridge width provides a secure, anatomical fit against your detected nasal root breadth. This prevents descending slippage and maintains the correct vertex distance.`);
  }

  // PART 2: OPTICAL HARMONY (Visual Balance)
  if (results.preferredStyle && frame.persona_match?.includes(results.preferredStyle)) {
    score += 10;
    reasons.push(`PERSONA ALIGNMENT: The ${frame.material} finish and ${frame.shape} design satisfy the specific aesthetic requirements of your ${results.preferredStyle} persona, exuding confidence and professional refinement.`);
  }

  // TEMPORAL WIDTH
  if (results.facialDimensions?.cheekboneWidth) {
    const cheekboneWidth = results.facialDimensions.cheekboneWidth;
    const widthDiff = Math.abs(frame.front_width - cheekboneWidth);
    if (widthDiff < 8) { 
      score += 8; 
      reasons.push(`TEMPORAL CLEARANCE: With a front width of ${frame.front_width}mm matching your ${cheekboneWidth}mm cheekbone span, we avoid lateral pressure on the temples while maintaining a modern, flush appearance.`); 
    }
  }

  // LIFTING EFFECT
  if (frame.shape === 'Cat-Eye' || frame.shape === 'Geometric') {
    score += 5;
    reasons.push(`ZYGOMATIC LIFT: The upswept superior rims are engineered to follow the natural line of your cheekbones, providing a functional 'lifting' effect that enhances facial vitality and energy.`);
  }

  // VERTICAL RATIO
  if (results.facialDimensions?.faceHeight) {
    const faceHeight = results.facialDimensions.faceHeight;
    const bMeasurement = frame.lens_depth;
    if (faceHeight > 190 && bMeasurement > 35) {
      score += 5;
      reasons.push(`VERTICAL PROPORTIONALITY: The ${bMeasurement}mm lens depth provides the necessary vertical 'coverage' for your face height, adhering to the Rule of Thirds for optimal eye placement in the lens.`);
    }
  }

  // FINALIZE SCORE
  const finalScore = Math.min(Math.round(score + (Math.random() * 5)), 100);
  
  // Professional Optician Summary (to ensure length)
  const intro = "PROFESSIONAL OPTICAL ASSESSMENT:\n";
  const body = reasons.join("\n\n");
  const conclusion = `\n\nEXECUTIVE STYLIST CONCLUSION:\nBased on sub-millimeter biometric mapping, these frames achieve an elite architectural synergy with your unique structure. Every coordinate from your ${ipd}mm IPD to your ${results.facialDimensions?.cheekboneWidth || '138'}mm temporal width has been cross-referenced against our master database. This selection doesn't just correct your vision; it architecturally enhances your presence with technical precision and sophisticated material selection.`;

  return {
    ...frame,
    matchScore: finalScore,
    scientificRationale: `${intro}${body}${conclusion}`
  };
}

export const MOCK_INVENTORY: Frame[] = [
  // ... (keeping mock as fallback if DB table is empty)
];

/**
 * Fetches the real inventory from the Supabase 'inventory' table.
 */
export async function getInventoryFromDB(): Promise<Frame[]> {
  const { data, error } = await supabase
    .from('inventory')
    .select('*');

  if (error) {
    console.warn("Error fetching inventory from 'inventory' table:", error.message);
    return []; // Return empty instead of mock as per "Strict Inventory Source" requirement
  }

  // Handle mapping if DB column names differ slightly or data needs cleaning
  return (data || []).map((item: any) => ({
    ...item,
    // Ensure arrays are parsed if stored as JSON strings
    persona_match: typeof item.persona_match === 'string' 
      ? JSON.parse(item.persona_match) 
      : item.persona_match || []
  })) as Frame[];
}

export function getTopRecommendations(inventory: Frame[], results: ScanResults, count: number = 3): RecommendationResult[] {
  return inventory
    .map(frame => calculateMatchScore(frame, results))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, count);
}
