// Color utilities for the canvas application

// Plant border color palette - vibrant and diverse colors
export const PLANT_BORDER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Mint Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Light Yellow
  '#BB8FCE', // Purple
  '#85C1E9', // Light Blue
  '#82E0AA', // Light Green
  '#F8C471', // Orange
  '#F1948A', // Light Red
  '#85929E', // Gray Blue
  '#A569BD', // Purple
  '#5DADE2', // Sky Blue
  '#58D68D', // Green
  '#F4D03F', // Gold
  '#EC7063', // Salmon
  '#48C9B0', // Turquoise
];

// Shape color palette - professional and varied
export const SHAPE_COLORS = [
  '#3498DB', // Blue
  '#E74C3C', // Red
  '#2ECC71', // Green
  '#F39C12', // Orange
  '#9B59B6', // Purple
  '#1ABC9C', // Turquoise
  '#E67E22', // Dark Orange
  '#34495E', // Dark Gray
  '#16A085', // Dark Turquoise
  '#27AE60', // Dark Green
  '#2980B9', // Dark Blue
  '#8E44AD', // Dark Purple
  '#F1C40F', // Yellow
  '#E91E63', // Pink
  '#FF5722', // Deep Orange
];

// Terrain color enhancements
export const TERRAIN_COLORS = {
  soil: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3'],
  water: ['#4682B4', '#87CEEB', '#20B2AA', '#48D1CC', '#00CED1'],
  vegetation: ['#228B22', '#32CD32', '#9ACD32', '#6B8E23', '#556B2F'],
  structure: ['#696969', '#A9A9A9', '#D3D3D3', '#778899', '#708090'],
  energy: ['#FFD700', '#FFA500', '#FF8C00', '#FF4500', '#DC143C'],
};

/**
 * Generate a consistent color for a plant based on its ID
 * This ensures the same plant always gets the same color
 */
export const getPlantBorderColor = (plantId: string): string => {
  // Create a simple hash of the plant ID
  let hash = 0;
  for (let i = 0; i < plantId.length; i++) {
    const char = plantId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from the palette
  const colorIndex = Math.abs(hash) % PLANT_BORDER_COLORS.length;
  return PLANT_BORDER_COLORS[colorIndex];
};

/**
 * Generate a consistent color for shapes based on their ID
 */
export const getShapeColor = (shapeId: string | number): string => {
  // Create a simple hash of the shape ID
  const idString = String(shapeId);
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    const char = idString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from the palette
  const colorIndex = Math.abs(hash) % SHAPE_COLORS.length;
  return SHAPE_COLORS[colorIndex];
};

/**
 * Get a terrain color from the appropriate category
 */
export const getTerrainColor = (category: string, index: number = 0): string => {
  const categoryColors = TERRAIN_COLORS[category as keyof typeof TERRAIN_COLORS];
  if (!categoryColors) {
    return TERRAIN_COLORS.soil[0]; // Default to soil color
  }
  return categoryColors[index % categoryColors.length];
};

/**
 * Convert hex color to RGB with alpha
 */
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Generate a lighter version of a color
 */
export const lightenColor = (hex: string, amount: number = 0.3): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = Math.min(255, parseInt(result[1], 16) + Math.floor(255 * amount));
  const g = Math.min(255, parseInt(result[2], 16) + Math.floor(255 * amount));
  const b = Math.min(255, parseInt(result[3], 16) + Math.floor(255 * amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Generate a darker version of a color
 */
export const darkenColor = (hex: string, amount: number = 0.3): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = Math.max(0, parseInt(result[1], 16) - Math.floor(255 * amount));
  const g = Math.max(0, parseInt(result[2], 16) - Math.floor(255 * amount));
  const b = Math.max(0, parseInt(result[3], 16) - Math.floor(255 * amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};