import { Structure } from '../types/canvasTypes';

export const structures: Structure[] = [
  // Água (Water structures)
  {
    id: 'cisterna',
    name: 'Cisterna',
    category: 'Água',
    icon: '💧',
    color: '#4A90E2',
    size: { width: 3, height: 3 },
    description: 'Cisterna para captação e armazenamento de água da chuva'
  },
  {
    id: 'caixa-dagua',
    name: 'Caixa d\'água',
    category: 'Água',
    icon: '🚰',
    color: '#5BA3F5',
    size: { width: 2, height: 2 },
    description: 'Reservatório elevado para distribuição de água'
  },
  {
    id: 'poco',
    name: 'Poço',
    category: 'Água',
    icon: '🕳️',
    color: '#2E86DE',
    size: { width: 1.5, height: 1.5 },
    description: 'Poço artesiano ou cacimba para captação de água subterrânea'
  },
  {
    id: 'lago-artificial',
    name: 'Lago artificial',
    category: 'Água',
    icon: '🏞️',
    color: '#3498DB',
    size: { width: 10, height: 8 },
    description: 'Lago artificial para irrigação e criação de peixes'
  },
  
  // Edificações (Buildings)
  {
    id: 'casa-principal',
    name: 'Casa principal',
    category: 'Edificações',
    icon: '🏠',
    color: '#8B6F47',
    size: { width: 8, height: 10 },
    description: 'Residência principal da propriedade'
  },
  {
    id: 'galpao',
    name: 'Galpão',
    category: 'Edificações',
    icon: '🏚️',
    color: '#A0826D',
    size: { width: 12, height: 8 },
    description: 'Galpão para armazenamento de equipamentos e produção'
  },
  {
    id: 'estufa',
    name: 'Estufa',
    category: 'Edificações',
    icon: '🏭',
    color: '#90EE90',
    size: { width: 6, height: 4 },
    description: 'Estufa para cultivo protegido'
  },
  {
    id: 'galinheiro',
    name: 'Galinheiro',
    category: 'Edificações',
    icon: '🐓',
    color: '#CD853F',
    size: { width: 4, height: 3 },
    description: 'Estrutura para criação de galinhas'
  },
  {
    id: 'celeiro',
    name: 'Celeiro',
    category: 'Edificações',
    icon: '🏘️',
    color: '#D2691E',
    size: { width: 6, height: 6 },
    description: 'Armazém para grãos e produtos agrícolas'
  },
  
  // Energia (Energy)
  {
    id: 'painel-solar',
    name: 'Painel solar',
    category: 'Energia',
    icon: '☀️',
    color: '#FFD700',
    size: { width: 2, height: 1 },
    description: 'Painel fotovoltaico para geração de energia solar'
  },
  {
    id: 'turbina-eolica',
    name: 'Turbina eólica',
    category: 'Energia',
    icon: '💨',
    color: '#87CEEB',
    size: { width: 1, height: 8 },
    description: 'Turbina para geração de energia eólica'
  },
  {
    id: 'biodigestor',
    name: 'Biodigestor',
    category: 'Energia',
    icon: '♻️',
    color: '#228B22',
    size: { width: 3, height: 3 },
    description: 'Sistema para produção de biogás e biofertilizante'
  },
  
  // Compostagem (Composting)
  {
    id: 'composteira',
    name: 'Composteira',
    category: 'Compostagem',
    icon: '🌱',
    color: '#8B4513',
    size: { width: 2, height: 2 },
    description: 'Estrutura para compostagem de resíduos orgânicos'
  },
  {
    id: 'minhocario',
    name: 'Minhocário',
    category: 'Compostagem',
    icon: '🪱',
    color: '#654321',
    size: { width: 1.5, height: 1.5 },
    description: 'Sistema de vermicompostagem'
  },
  {
    id: 'leira-compostagem',
    name: 'Leira de compostagem',
    category: 'Compostagem',
    icon: '🏔️',
    color: '#8B7355',
    size: { width: 4, height: 1.5 },
    description: 'Leira para compostagem em grande escala'
  },
  
  // Cercas e Divisórias (Fences and Divisions)
  {
    id: 'cerca-viva',
    name: 'Cerca viva',
    category: 'Cercas',
    icon: '🌳',
    color: '#228B22',
    size: { width: 0.5, height: 2 },
    description: 'Cerca viva com plantas nativas'
  },
  {
    id: 'cerca-madeira',
    name: 'Cerca de madeira',
    category: 'Cercas',
    icon: '🪵',
    color: '#8B4513',
    size: { width: 0.3, height: 1.5 },
    description: 'Cerca tradicional de madeira'
  },
  {
    id: 'portao',
    name: 'Portão',
    category: 'Cercas',
    icon: '🚪',
    color: '#696969',
    size: { width: 3, height: 2 },
    description: 'Portão de entrada'
  },
  
  // Caminhos (Paths)
  {
    id: 'trilha-pedra',
    name: 'Trilha de pedra',
    category: 'Caminhos',
    icon: '🪨',
    color: '#808080',
    size: { width: 1, height: 1 },
    description: 'Caminho com pedras naturais'
  },
  {
    id: 'caminho-madeira',
    name: 'Caminho de madeira',
    category: 'Caminhos',
    icon: '🪜',
    color: '#A0522D',
    size: { width: 1, height: 1 },
    description: 'Deck ou caminho de madeira'
  },
  {
    id: 'estrada-terra',
    name: 'Estrada de terra',
    category: 'Caminhos',
    icon: '🛤️',
    color: '#D2691E',
    size: { width: 3, height: 1 },
    description: 'Estrada de terra batida'
  },
  
  // Infraestrutura (Infrastructure)
  {
    id: 'ponte',
    name: 'Ponte',
    category: 'Infraestrutura',
    icon: '🌉',
    color: '#708090',
    size: { width: 2, height: 4 },
    description: 'Ponte sobre curso d\'água'
  },
  {
    id: 'pergolado',
    name: 'Pergolado',
    category: 'Infraestrutura',
    icon: '🏛️',
    color: '#8B7D6B',
    size: { width: 4, height: 3 },
    description: 'Estrutura de sombreamento'
  },
  {
    id: 'banco-jardim',
    name: 'Banco de jardim',
    category: 'Infraestrutura',
    icon: '🪑',
    color: '#8B4513',
    size: { width: 1.5, height: 0.5 },
    description: 'Banco para área de descanso'
  },
  {
    id: 'forno-lenha',
    name: 'Forno a lenha',
    category: 'Infraestrutura',
    icon: '🔥',
    color: '#B22222',
    size: { width: 2, height: 2 },
    description: 'Forno tradicional a lenha'
  },
  
  // Irrigação (Irrigation)
  {
    id: 'aspersor',
    name: 'Aspersor',
    category: 'Irrigação',
    icon: '💦',
    color: '#4169E1',
    size: { width: 0.5, height: 0.5 },
    description: 'Aspersor para irrigação'
  },
  {
    id: 'gotejador',
    name: 'Gotejador',
    category: 'Irrigação',
    icon: '💧',
    color: '#1E90FF',
    size: { width: 0.3, height: 0.3 },
    description: 'Sistema de irrigação por gotejamento'
  },
  {
    id: 'canal-irrigacao',
    name: 'Canal de irrigação',
    category: 'Irrigação',
    icon: '〰️',
    color: '#4682B4',
    size: { width: 0.5, height: 10 },
    description: 'Canal para condução de água'
  },
  {
    id: 'valvula-irrigacao',
    name: 'Válvula de irrigação',
    category: 'Irrigação',
    icon: '🔧',
    color: '#696969',
    size: { width: 0.5, height: 0.5 },
    description: 'Válvula de controle de irrigação'
  }
];

// Função auxiliar para buscar estruturas por categoria
export function getStructuresByCategory(category: string): Structure[] {
  return structures.filter(structure => structure.category === category);
}

// Função auxiliar para buscar uma estrutura por ID
export function getStructureById(id: string): Structure | undefined {
  return structures.find(structure => structure.id === id);
}

// Categorias disponíveis
export const structureCategories = [
  'Água',
  'Edificações',
  'Energia',
  'Compostagem',
  'Cercas',
  'Caminhos',
  'Infraestrutura',
  'Irrigação'
];
