/**
 * Enhanced Element Library with Icons and Better Data
 * Comprehensive Brazilian permaculture and agriculture database
 */

import type { Plant, Terrain, Structure } from '@/types/canvas'

// ============================================================================
// ICON MAPPINGS - Quick lookup for element icons
// ============================================================================

export const PLANT_ICONS: Record<string, string> = {
  Tomate: '🍅',
  Alface: '🥬',
  Cenoura: '🥕',
  Pimentão: '🫑',
  Couve: '🥬',
  Beterraba: '🫐',
  Manjericão: '🌿',
  Salsa: '🌿',
  Rúcula: '🥗',
  Espinafre: '🥬',
  Laranjeira: '🍊',
  Limoeiro: '🍋',
  Bananeira: '🍌',
  Abacateiro: '🥑',
  Morango: '🍓',
  Melancia: '🍉',
  Abóbora: '🎃',
  Milho: '🌽',
}

export const TERRAIN_ICONS: Record<string, string> = {
  'Solo Fértil': '🟫',
  'Solo Arenoso': '🟨',
  'Solo Argiloso': '🟤',
  Compostagem: '♻️',
  'Solo Calcário': '⬜',
  'Solo Ácido': '🟧',
  Água: '💧',
  Pedra: '🪨',
  Grama: '🟩',
}

export const STRUCTURE_ICONS: Record<string, string> = {
  Estufa: '🏠',
  Cerca: '🚧',
  'Sistema de Irrigação': '💧',
  Composteira: '♻️',
  Pergolado: '🏛️',
  'Canteiro Elevado': '📦',
  Reservatório: '🛢️',
  Galpão: '🏭',
  Casa: '🏡',
  Galinheiro: '🐔',
}

export function getElementIcon(name: string, type: 'plant' | 'terrain' | 'structure'): string {
  switch (type) {
    case 'plant':
      return PLANT_ICONS[name] || '🌱'
    case 'terrain':
      return TERRAIN_ICONS[name] || '🟫'
    case 'structure':
      return STRUCTURE_ICONS[name] || '🏗️'
    default:
      return '⚪'
  }
}

// ============================================================================
// PLANTS DATA - Original format maintained for compatibility
// ============================================================================

export const ENHANCED_PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Tomate',
    category: 'Fruto',
    description: 'Planta de tomate para horta doméstica, rica em licopeno',
    spacingMeters: 0.5,
    canopyDiameterMeters: 0.6,
    heightMeters: 1.5,
    color: '#ef4444',
  },
  {
    id: '2',
    name: 'Alface',
    category: 'Folhosa',
    description: 'Verdura folhosa de crescimento rápido, ideal para saladas',
    spacingMeters: 0.3,
    canopyDiameterMeters: 0.3,
    heightMeters: 0.3,
    color: '#84cc16',
  },
  {
    id: '3',
    name: 'Cenoura',
    category: 'Raiz',
    description: 'Raiz comestível rica em vitamina A e betacaroteno',
    spacingMeters: 0.1,
    canopyDiameterMeters: 0.15,
    heightMeters: 0.3,
    color: '#f97316',
  },
  {
    id: '4',
    name: 'Pimentão',
    category: 'Fruto',
    description: 'Pimento doce colorido, rico em vitamina C',
    spacingMeters: 0.5,
    canopyDiameterMeters: 0.5,
    heightMeters: 0.8,
    color: '#eab308',
  },
  {
    id: '5',
    name: 'Couve',
    category: 'Folhosa',
    description: 'Verdura resistente e nutritiva, fonte de ferro',
    spacingMeters: 0.5,
    canopyDiameterMeters: 0.6,
    heightMeters: 0.6,
    color: '#16a34a',
  },
  {
    id: '6',
    name: 'Beterraba',
    category: 'Raiz',
    description: 'Raiz doce e colorida, rica em folato',
    spacingMeters: 0.15,
    canopyDiameterMeters: 0.2,
    heightMeters: 0.3,
    color: '#dc2626',
  },
  {
    id: '7',
    name: 'Manjericão',
    category: 'Erva',
    description: 'Erva aromática para temperos e chás',
    spacingMeters: 0.25,
    canopyDiameterMeters: 0.3,
    heightMeters: 0.5,
    color: '#22c55e',
  },
  {
    id: '8',
    name: 'Salsa',
    category: 'Erva',
    description: 'Erva versátil para temperos e decoração',
    spacingMeters: 0.2,
    canopyDiameterMeters: 0.25,
    heightMeters: 0.3,
    color: '#10b981',
  },
  {
    id: '9',
    name: 'Rúcula',
    category: 'Folhosa',
    description: 'Folha picante ideal para saladas gourmet',
    spacingMeters: 0.15,
    canopyDiameterMeters: 0.2,
    heightMeters: 0.2,
    color: '#65a30d',
  },
  {
    id: '10',
    name: 'Espinafre',
    category: 'Folhosa',
    description: 'Verdura rica em ferro e vitaminas',
    spacingMeters: 0.15,
    canopyDiameterMeters: 0.2,
    heightMeters: 0.3,
    color: '#15803d',
  },
  {
    id: '11',
    name: 'Laranjeira',
    category: 'Árvore Frutífera',
    description: 'Árvore cítrica produtora de laranjas',
    spacingMeters: 5,
    canopyDiameterMeters: 4,
    heightMeters: 6,
    color: '#fb923c',
  },
  {
    id: '12',
    name: 'Limoeiro',
    category: 'Árvore Frutífera',
    description: 'Árvore cítrica produtora de limões',
    spacingMeters: 4,
    canopyDiameterMeters: 3,
    heightMeters: 5,
    color: '#facc15',
  },
  {
    id: '13',
    name: 'Bananeira',
    category: 'Árvore Frutífera',
    description: 'Planta tropical produtora de bananas',
    spacingMeters: 3,
    canopyDiameterMeters: 2.5,
    heightMeters: 4,
    color: '#fde047',
  },
  {
    id: '14',
    name: 'Abacateiro',
    category: 'Árvore Frutífera',
    description: 'Árvore produtora de abacates',
    spacingMeters: 8,
    canopyDiameterMeters: 6,
    heightMeters: 10,
    color: '#166534',
  },
  {
    id: '15',
    name: 'Morango',
    category: 'Fruto',
    description: 'Planta rasteira produtora de morangos',
    spacingMeters: 0.3,
    canopyDiameterMeters: 0.3,
    heightMeters: 0.2,
    color: '#f43f5e',
  },
  {
    id: '16',
    name: 'Melancia',
    category: 'Fruto',
    description: 'Planta rasteira de frutos grandes e suculentos',
    spacingMeters: 2,
    canopyDiameterMeters: 2,
    heightMeters: 0.3,
    color: '#14b8a6',
  },
  {
    id: '17',
    name: 'Abóbora',
    category: 'Fruto',
    description: 'Planta rasteira produtora de abóboras',
    spacingMeters: 1.5,
    canopyDiameterMeters: 1.5,
    heightMeters: 0.4,
    color: '#f59e0b',
  },
  {
    id: '18',
    name: 'Milho',
    category: 'Grão',
    description: 'Cereal alto e produtivo',
    spacingMeters: 0.3,
    canopyDiameterMeters: 0.4,
    heightMeters: 2.5,
    color: '#fbbf24',
  },
]

export const ENHANCED_TERRAINS: Terrain[] = [
  {
    id: '1',
    name: 'Solo Fértil',
    type: 'Orgânico',
    description: 'Solo rico em nutrientes e matéria orgânica, ideal para a maioria das culturas',
    color: '#78350f',
  },
  {
    id: '2',
    name: 'Solo Arenoso',
    type: 'Drenagem',
    description: 'Solo com boa drenagem, ideal para plantas que não toleram encharcamento',
    color: '#fbbf24',
  },
  {
    id: '3',
    name: 'Solo Argiloso',
    type: 'Retenção',
    description: 'Solo que retém bem a água e nutrientes',
    color: '#92400e',
  },
  {
    id: '4',
    name: 'Compostagem',
    type: 'Enriquecido',
    description: 'Área para compostagem e enriquecimento do solo',
    color: '#65a30d',
  },
  {
    id: '5',
    name: 'Solo Calcário',
    type: 'Alcalino',
    description: 'Solo com pH elevado, ideal para plantas que preferem ambiente alcalino',
    color: '#d6d3d1',
  },
  {
    id: '6',
    name: 'Solo Ácido',
    type: 'Ácido',
    description: 'Solo com pH baixo, ideal para plantas acidófilas',
    color: '#b45309',
  },
]

export const ENHANCED_STRUCTURES: Structure[] = [
  {
    id: '1',
    name: 'Estufa',
    type: 'Proteção',
    description: 'Estrutura para proteção contra intempéries e controle climático',
    widthMeters: 6,
    heightMeters: 4,
    lengthMeters: 10,
    color: '#06b6d4',
  },
  {
    id: '2',
    name: 'Cerca',
    type: 'Delimitação',
    description: 'Delimitação e proteção da área de cultivo',
    widthMeters: 0.1,
    heightMeters: 2,
    color: '#78716c',
  },
  {
    id: '3',
    name: 'Sistema de Irrigação',
    type: 'Sistema',
    description: 'Sistema de irrigação por gotejamento',
    widthMeters: 1,
    heightMeters: 1,
    color: '#0ea5e9',
  },
  {
    id: '4',
    name: 'Composteira',
    type: 'Processamento',
    description: 'Estrutura para compostagem de resíduos orgânicos',
    widthMeters: 1.5,
    heightMeters: 1.5,
    color: '#a16207',
  },
  {
    id: '5',
    name: 'Pergolado',
    type: 'Suporte',
    description: 'Estrutura de suporte para plantas trepadeiras',
    widthMeters: 3,
    heightMeters: 2.5,
    color: '#92400e',
  },
  {
    id: '6',
    name: 'Canteiro Elevado',
    type: 'Cultivo',
    description: 'Canteiro elevado para melhor drenagem',
    widthMeters: 1.2,
    heightMeters: 3,
    color: '#854d0e',
  },
  {
    id: '7',
    name: 'Reservatório',
    type: 'Armazenamento',
    description: 'Reservatório para armazenamento de água',
    widthMeters: 2,
    heightMeters: 2,
    color: '#0284c7',
  },
  {
    id: '8',
    name: 'Galpão',
    type: 'Armazenamento',
    description: 'Galpão para ferramentas e equipamentos',
    widthMeters: 4,
    heightMeters: 5,
    color: '#57534e',
  },
  {
    id: '9',
    name: 'Casa',
    type: 'Edificação',
    description: 'Casa residencial',
    widthMeters: 10,
    heightMeters: 8,
    color: '#dc2626',
  },
  {
    id: '10',
    name: 'Galinheiro',
    type: 'Criação',
    description: 'Estrutura para criação de galinhas',
    widthMeters: 3,
    heightMeters: 2,
    color: '#ea580c',
  },
]
