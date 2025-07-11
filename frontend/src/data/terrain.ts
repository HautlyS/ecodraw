import { Terrain } from '@/types/canvasTypes';

export const TERRAIN_CATEGORIES = [
  { id: "all", name: "Todos", icon: "Mountain" },
  { id: "cultivation", name: "Cultivo", icon: "Wheat" },
  { id: "water", name: "Água", icon: "Droplets" },
  { id: "natural", name: "Natural", icon: "Trees" },
  { id: "paths", name: "Caminhos", icon: "Route" },
  { id: "zones", name: "Zonas", icon: "Square" },
  { id: "protection", name: "Proteção", icon: "Shield" },
] as const;

export const TERRAIN_DATA: Terrain[] = [
  // Cultivo (Cultivation)
  {
    id: "campo-cultivo",
    name: "Campo de cultivo",
    category: "cultivation",
    color: "#8B4513",
    pattern: "solid",
    description: "Área preparada para plantio geral"
  },
  {
    id: "canteiro-elevado",
    name: "Canteiro elevado",
    category: "cultivation",
    color: "#654321",
    pattern: "solid",
    description: "Canteiro elevado para hortaliças e ervas"
  },
  {
    id: "horta-mandala",
    name: "Horta mandala",
    category: "cultivation",
    color: "#228B22",
    pattern: "solid",
    description: "Design circular permacultural"
  },
  {
    id: "espiral-ervas",
    name: "Espiral de ervas",
    category: "cultivation",
    color: "#32CD32",
    pattern: "solid",
    description: "Estrutura espiral para ervas aromáticas"
  },
  {
    id: "terracos",
    name: "Terraços",
    category: "cultivation",
    color: "#8B7D6B",
    pattern: "solid",
    description: "Terraços para cultivo em declive"
  },
  {
    id: "leiras",
    name: "Leiras",
    category: "cultivation",
    color: "#A0522D",
    pattern: "solid",
    description: "Leiras elevadas para drenagem"
  },

  // Água (Water)
  {
    id: "lago",
    name: "Lago",
    category: "water",
    color: "#1E90FF",
    pattern: "solid",
    description: "Corpo d'água natural ou artificial"
  },
  {
    id: "brejo",
    name: "Brejo",
    category: "water",
    color: "#4682B4",
    pattern: "solid",
    description: "Área alagada para filtragem natural"
  },
  {
    id: "rio",
    name: "Rio",
    category: "water",
    color: "#4169E1",
    pattern: "solid",
    description: "Curso d'água corrente"
  },
  {
    id: "acude",
    name: "Açude",
    category: "water",
    color: "#5F9EA0",
    pattern: "solid",
    description: "Reservatório de água"
  },
  {
    id: "bacia-retencao",
    name: "Bacia de retenção",
    category: "water",
    color: "#6495ED",
    pattern: "solid",
    description: "Área para captação de água pluvial"
  },
  {
    id: "swale",
    name: "Swale",
    category: "water",
    color: "#87CEEB",
    pattern: "solid",
    description: "Valeta de infiltração permacultural"
  },

  // Natural (Natural areas)
  {
    id: "mata-nativa",
    name: "Mata nativa",
    category: "natural",
    color: "#006400",
    pattern: "solid",
    description: "Floresta nativa preservada"
  },
  {
    id: "bosque",
    name: "Bosque",
    category: "natural",
    color: "#228B22",
    pattern: "solid",
    description: "Área arborizada menos densa"
  },
  {
    id: "pasto",
    name: "Pasto",
    category: "natural",
    color: "#90EE90",
    pattern: "solid",
    description: "Área de pastagem"
  },
  {
    id: "campo-nativo",
    name: "Campo nativo",
    category: "natural",
    color: "#9ACD32",
    pattern: "solid",
    description: "Vegetação campestre natural"
  },
  {
    id: "area-regeneracao",
    name: "Área em regeneração",
    category: "natural",
    color: "#6B8E23",
    pattern: "solid",
    description: "Área em processo de recuperação"
  },
  {
    id: "saf",
    name: "Sistema agroflorestal",
    category: "natural",
    color: "#556B2F",
    pattern: "solid",
    description: "Sistema agroflorestal integrado"
  },

  // Caminhos (Paths)
  {
    id: "trilha",
    name: "Trilha",
    category: "paths",
    color: "#D2691E",
    pattern: "solid",
    description: "Caminho estreito de terra"
  },
  {
    id: "estrada-acesso",
    name: "Estrada de acesso",
    category: "paths",
    color: "#A0522D",
    pattern: "solid",
    description: "Via principal de acesso"
  },
  {
    id: "caminho-pedestre",
    name: "Caminho pedestre",
    category: "paths",
    color: "#BC8F8F",
    pattern: "solid",
    description: "Passagem para pedestres"
  },
  {
    id: "carreador",
    name: "Carreador",
    category: "paths",
    color: "#8B7355",
    pattern: "solid",
    description: "Caminho para veículos agrícolas"
  },

  // Zonas (Zones)
  {
    id: "zona-1",
    name: "Zona 1 - Intensiva",
    category: "zones",
    color: "#FF6B6B",
    pattern: "solid",
    description: "Área de uso intensivo próxima à casa"
  },
  {
    id: "zona-2",
    name: "Zona 2 - Cultivo",
    category: "zones",
    color: "#FFE66D",
    pattern: "solid",
    description: "Área de cultivo semi-intensivo"
  },
  {
    id: "zona-3",
    name: "Zona 3 - Produção",
    category: "zones",
    color: "#95E1D3",
    pattern: "solid",
    description: "Produção extensiva e pasto"
  },
  {
    id: "zona-4",
    name: "Zona 4 - Silvicultura",
    category: "zones",
    color: "#A8E6CF",
    pattern: "solid",
    description: "Área de manejo florestal"
  },
  {
    id: "zona-5",
    name: "Zona 5 - Silvestre",
    category: "zones",
    color: "#C7CEEA",
    pattern: "solid",
    description: "Área silvestre sem intervenção"
  },
  {
    id: "area-social",
    name: "Área social",
    category: "zones",
    color: "#FFB6C1",
    pattern: "solid",
    description: "Espaço para eventos e convivência"
  },
  {
    id: "area-compostagem",
    name: "Área de compostagem",
    category: "zones",
    color: "#8B4513",
    pattern: "solid",
    description: "Zona dedicada à compostagem"
  },

  // Proteção (Protection)
  {
    id: "quebra-vento",
    name: "Quebra-vento",
    category: "protection",
    color: "#2F4F4F",
    pattern: "solid",
    description: "Barreira contra ventos fortes"
  },
  {
    id: "faixa-protecao",
    name: "Faixa de proteção",
    category: "protection",
    color: "#708090",
    pattern: "solid",
    description: "Área de proteção ambiental"
  },
  {
    id: "aceiro",
    name: "Aceiro",
    category: "protection",
    color: "#F5DEB3",
    pattern: "solid",
    description: "Faixa limpa contra incêndios"
  },
  {
    id: "zona-amortecimento",
    name: "Zona de amortecimento",
    category: "protection",
    color: "#778899",
    pattern: "solid",
    description: "Área de transição e proteção"
  }
];

// Helper functions
export function getTerrainsByCategory(category: string): Terrain[] {
  if (category === 'all') {
    return TERRAIN_DATA;
  }
  return TERRAIN_DATA.filter(terrain => terrain.category === category);
}

export function getTerrainById(id: string): Terrain | undefined {
  return TERRAIN_DATA.find(terrain => terrain.id === id);
}

export function searchTerrain(query: string): Terrain[] {
  const lowerQuery = query.toLowerCase();
  return TERRAIN_DATA.filter(terrain => 
    terrain.name.toLowerCase().includes(lowerQuery) ||
    terrain.description.toLowerCase().includes(lowerQuery)
  );
}

// Export categories for use in UI
export const terrainCategoryNames = TERRAIN_CATEGORIES.map(cat => cat.name);
