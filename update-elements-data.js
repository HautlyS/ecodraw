// Temporary script to update elements.ts with comprehensive data
const fs = require('fs')

const plantsData = `
// ============================================================================
// COMPREHENSIVE PLANTS DATA
// ============================================================================

interface PlantData {
  id: string;
  name: string;
  category: string;
  spacing: string;
  color: string;
  icon: string;
  description: string;
}

// Convert new format to old format
function convertPlantData(plant: PlantData): Plant {
  const spacing = parseSpacing(plant.spacing);
  return {
    id: plant.id,
    name: plant.name,
    category: plant.category,
    description: plant.description,
    spacingMeters: spacing,
    canopyDiameterMeters: spacing * 0.8,
    heightMeters: spacing * 1.2,
    color: plant.color,
  };
}

const PLANTS_RAW_DATA: PlantData[] = [
  // Trees - Árvores Nativas e Ornamentais
  { id: "tree-1", name: "Eucalipto", category: "trees", spacing: "3x3m", color: "#047857", icon: "🌳", description: "Árvore de crescimento rápido" },
  { id: "tree-2", name: "Ipê Amarelo", category: "trees", spacing: "5x5m", color: "#fbbf24", icon: "🌳", description: "Árvore nativa ornamental" },
  { id: "tree-3", name: "Pau-Brasil", category: "trees", spacing: "4x4m", color: "#b91c1c", icon: "🌳", description: "Árvore nativa símbolo do Brasil" },
  { id: "tree-4", name: "Jatobá", category: "trees", spacing: "6x6m", color: "#92400e", icon: "🌳", description: "Árvore nativa de madeira nobre" },
  { id: "tree-5", name: "Cedro", category: "trees", spacing: "5x5m", color: "#7c2d12", icon: "🌲", description: "Árvore de madeira aromática" },
  { id: "tree-6", name: "Ipê Rosa", category: "trees", spacing: "5x5m", color: "#ec4899", icon: "🌳", description: "Árvore ornamental de floração exuberante" },
  { id: "tree-7", name: "Ipê Roxo", category: "trees", spacing: "5x5m", color: "#9333ea", icon: "🌳", description: "Árvore nativa de flores roxas" },
  { id: "tree-8", name: "Ipê Branco", category: "trees", spacing: "6x6m", color: "#f8fafc", icon: "🌳", description: "Árvore ornamental de flores brancas" },
  { id: "tree-9", name: "Aroeira", category: "trees", spacing: "4x4m", color: "#dc2626", icon: "🌳", description: "Árvore nativa medicinal" },
  { id: "tree-10", name: "Peroba Rosa", category: "trees", spacing: "7x7m", color: "#f472b6", icon: "🌳", description: "Madeira nobre de alta qualidade" },
  { id: "tree-11", name: "Jacarandá", category: "trees", spacing: "6x6m", color: "#7c3aed", icon: "🌳", description: "Árvore ornamental de flores lilás" },
  { id: "tree-12", name: "Araucária", category: "trees", spacing: "8x8m", color: "#065f46", icon: "🌲", description: "Pinheiro nativo do sul do Brasil" },
  { id: "tree-13", name: "Mogno", category: "trees", spacing: "8x8m", color: "#92400e", icon: "🌳", description: "Madeira nobre valiosa" },
  { id: "tree-14", name: "Cabreúva", category: "trees", spacing: "6x6m", color: "#78350f", icon: "🌳", description: "Árvore aromática nativa" },
  { id: "tree-15", name: "Paineira", category: "trees", spacing: "7x7m", color: "#f472b6", icon: "🌳", description: "Árvore de flores rosas e tronco barrigudo" },
  { id: "tree-16", name: "Sibipiruna", category: "trees", spacing: "5x5m", color: "#fbbf24", icon: "🌳", description: "Árvore ornamental urbana" },
  { id: "tree-17", name: "Quaresmeira", category: "trees", spacing: "4x4m", color: "#a855f7", icon: "🌳", description: "Árvore de flores roxas vibrantes" },
  { id: "tree-18", name: "Pau-Ferro", category: "trees", spacing: "6x6m", color: "#57534e", icon: "🌳", description: "Madeira dura e resistente" },
  { id: "tree-19", name: "Guapuruvu", category: "trees", spacing: "8x8m", color: "#fbbf24", icon: "🌳", description: "Árvore de crescimento rápido" },
  { id: "tree-20", name: "Canafístula", category: "trees", spacing: "5x5m", color: "#facc15", icon: "🌳", description: "Árvore de flores amarelas pendentes" },
];

export const ENHANCED_PLANTS: Plant[] = PLANTS_RAW_DATA.map(convertPlantData);
`

console.log('Script created. Run with Node.js to see the data structure.')
