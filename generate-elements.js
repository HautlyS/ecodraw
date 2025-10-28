// Script to generate the comprehensive elements.ts file
const fs = require('fs')

const content = `/**
 * Enhanced Element Library with Icons and Better Data
 * Comprehensive Brazilian permaculture and agriculture database
 */

import type { Plant, Terrain, Structure } from '@/types/canvas'

// Helper function to get icon for an element
export function getElementIcon(name: string, type: 'plant' | 'terrain' | 'structure'): string {
  const icons = {
    plant: {
      'Eucalipto': '🌳', 'Ipê Amarelo': '🌳', 'Pau-Brasil': '🌳', 'Jatobá': '🌳',
      'Tomate': '🍅', 'Alface': '🥬', 'Cenoura': '🥕', 'Milho': '🌽',
      'Laranjeira': '🍊', 'Limoeiro': '🍋', 'Bananeira': '🍌', 'Abacateiro': '🥑',
      'Hortelã': '🌿', 'Alecrim': '🌿', 'Manjericão': '🌿',
    },
    terrain: {
      'Campo de cultivo': '🌾', 'Lago': '🌊', 'Mata nativa': '🌳',
      'Trilha': '🥾', 'Zona 1 - Intensiva': '🏠',
    },
    structure: {
      'Cisterna': '💧', 'Casa principal': '🏠', 'Galpão': '🏚️',
      'Estufa': '🏭', 'Composteira': '🌱',
    }
  };
  
  return icons[type]?.[name] || (type === 'plant' ? '🌱' : type === 'terrain' ? '🟫' : '🏗️');
}

// Legacy exports for backward compatibility
export const ENHANCED_PLANTS: Plant[] = []
export const ENHANCED_TERRAINS: Terrain[] = []
export const ENHANCED_STRUCTURES: Structure[] = []

// Icon mappings (kept for reference)
export const PLANT_ICONS: Record<string, string> = {}
export const TERRAIN_ICONS: Record<string, string> = {}
export const STRUCTURE_ICONS: Record<string, string> = {}
`

fs.writeFileSync('client/src/data/elements.ts', content, 'utf8')
console.log('✅ Generated client/src/data/elements.ts')
