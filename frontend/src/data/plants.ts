import { Plant } from "@/types/canvasTypes";

export const PLANT_CATEGORIES = [
  { id: "all", name: "Todas", icon: "Leaf" },
  { id: "favorites", name: "Favoritas", icon: "Star" },
  { id: "trees", name: "Árvores", icon: "Tree" },
  { id: "fruits", name: "Frutíferas", icon: "Apple" },
  { id: "vegetables", name: "Hortaliças", icon: "Leaf" },
  { id: "herbs", name: "Ervas", icon: "Plant" },
  { id: "flowers", name: "Flores", icon: "Flower" },
  { id: "medicinal", name: "Medicinais", icon: "Pill" },
  { id: "grains", name: "Grãos", icon: "Wheat" },
  { id: "roots", name: "Raízes", icon: "Carrot" },
  { id: "shrubs", name: "Arbustos", icon: "Trees" },
  { id: "cover_crops", name: "Adubação Verde", icon: "Sprout" },
] as const;

export const PLANTS_DATA: Plant[] = [
  // Trees (Árvores)
  {
    id: "tree-1",
    name: "Eucalipto",
    category: "trees",
    spacing: "3x3m",
    color: "#047857",
    icon: "🌳",
    description: "Árvore de crescimento rápido, usada para madeira e quebra-vento",
  },
  {
    id: "tree-2",
    name: "Ipê Amarelo",
    category: "trees",
    spacing: "5x5m",
    color: "#fbbf24",
    icon: "🌳",
    description: "Árvore nativa ornamental com flores amarelas",
  },
  {
    id: "tree-3",
    name: "Pau-Brasil",
    category: "trees",
    spacing: "4x4m",
    color: "#b91c1c",
    icon: "🌳",
    description: "Árvore nativa símbolo do Brasil",
  },
  {
    id: "tree-4",
    name: "Jatobá",
    category: "trees",
    spacing: "6x6m",
    color: "#92400e",
    icon: "🌳",
    description: "Árvore nativa de madeira nobre",
  },
  {
    id: "tree-5",
    name: "Cedro",
    category: "trees",
    spacing: "5x5m",
    color: "#7c2d12",
    icon: "🌲",
    description: "Árvore de madeira aromática e resistente",
  },

  // Fruit Trees (Frutíferas)
  {
    id: "fruit-1",
    name: "Abacateiro",
    category: "fruits",
    spacing: "8x8m",
    color: "#65a30d",
    icon: "🥑",
    description: "Árvore frutífera de abacate",
  },
  {
    id: "fruit-2",
    name: "Mangueira",
    category: "fruits",
    spacing: "10x10m",
    color: "#facc15",
    icon: "🥭",
    description: "Árvore frutífera tropical de manga",
  },
  {
    id: "fruit-3",
    name: "Laranjeira",
    category: "fruits",
    spacing: "4x4m",
    color: "#fb923c",
    icon: "🍊",
    description: "Árvore cítrica produtora de laranjas",
  },
  {
    id: "fruit-4",
    name: "Limoeiro",
    category: "fruits",
    spacing: "3x3m",
    color: "#fde047",
    icon: "🍋",
    description: "Árvore cítrica produtora de limões",
  },
  {
    id: "fruit-5",
    name: "Bananeira",
    category: "fruits",
    spacing: "3x3m",
    color: "#facc15",
    icon: "🍌",
    description: "Planta tropical produtora de bananas",
  },
  {
    id: "fruit-6",
    name: "Mamoeiro",
    category: "fruits",
    spacing: "2x2m",
    color: "#fb923c",
    icon: "🍈",
    description: "Árvore de crescimento rápido produtora de mamão",
  },
  {
    id: "fruit-7",
    name: "Goiabeira",
    category: "fruits",
    spacing: "5x5m",
    color: "#ec4899",
    icon: "🍐",
    description: "Árvore frutífera tropical de goiaba",
  },
  {
    id: "fruit-8",
    name: "Aceroleira",
    category: "fruits",
    spacing: "3x3m",
    color: "#dc2626",
    icon: "🍒",
    description: "Arbusto produtor de acerola rica em vitamina C",
  },
  {
    id: "fruit-9",
    name: "Jabuticabeira",
    category: "fruits",
    spacing: "4x4m",
    color: "#4c1d95",
    icon: "🫐",
    description: "Árvore nativa com frutos no tronco",
  },
  {
    id: "fruit-10",
    name: "Pitangueira",
    category: "fruits",
    spacing: "3x3m",
    color: "#dc2626",
    icon: "🍒",
    description: "Arbusto nativo com frutos vermelhos",
  },

  // Vegetables (Hortaliças)
  {
    id: "veg-1",
    name: "Tomate",
    category: "vegetables",
    spacing: "60x40cm",
    color: "#ef4444",
    icon: "🍅",
    description: "Rico em licopeno"
  },
  {
    id: "2",
    name: "Alface",
    category: "vegetables",
    spacing: "30x30cm",
    color: "#22c55e",
    icon: "🥬",
    description: "Folhosa de crescimento rápido"
  },
  {
    id: "3",
    name: "Manga",
    category: "fruits",
    spacing: "8x8m",
    color: "#f59e0b",
    icon: "🥭",
    description: "Árvore frutífera tropical"
  },
  {
    id: "4",
    name: "Cenoura",
    category: "roots",
    spacing: "20x15cm",
    color: "#f97316",
    icon: "🥕",
    description: "Rica em betacaroteno"
  },
  {
    id: "5",
    name: "Milho",
    category: "grains",
    spacing: "80x30cm",
    color: "#eab308",
    icon: "🌽",
    description: "Cereal básico nutritivo"
  },
  {
    id: "6",
    name: "Hortelã",
    category: "medicinal",
    spacing: "25x25cm",
    color: "#10b981",
    icon: "🌿",
    description: "Planta aromática medicinal"
  },
  {
    id: "7",
    name: "Laranja",
    category: "fruits",
    spacing: "6x6m",
    color: "#f97316",
    icon: "🍊",
    description: "Cítrica rica em vitamina C"
  },
  {
    id: "8",
    name: "Batata",
    category: "roots",
    spacing: "40x30cm",
    color: "#a3a3a3",
    icon: "🥔",
    description: "Tubérculo energético"
  },
  {
    id: "9",
    name: "Feijão",
    category: "grains",
    spacing: "30x10cm",
    color: "#7c2d12",
    icon: "🫘",
    description: "Leguminosa rica em proteína"
  },
  {
    id: "10",
    name: "Alecrim",
    category: "medicinal",
    spacing: "50x50cm",
    color: "#059669",
    icon: "🌿",
    description: "Erva aromática antioxidante"
  },
  // Additional plants can be added here
  {
    id: "11",
    name: "Abóbora",
    category: "vegetables",
    spacing: "2x2m",
    color: "#f97316",
    icon: "🎃",
    description: "Trepadeira produtiva"
  },
  {
    id: "12",
    name: "Cebola",
    category: "vegetables",
    spacing: "15x10cm",
    color: "#e11d48",
    icon: "🧅",
    description: "Bulbo aromático essencial"
  },
  {
    id: "13",
    name: "Morango",
    category: "fruits",
    spacing: "30x25cm",
    color: "#dc2626",
    icon: "🍓",
    description: "Fruta rasteira doce"
  },
  {
    id: "14",
    name: "Banana",
    category: "fruits",
    spacing: "3x3m",
    color: "#facc15",
    icon: "🍌",
    description: "Musácea tropical nutritiva"
  },
  {
    id: "15",
    name: "Mandioca",
    category: "roots",
    spacing: "1x1m",
    color: "#a16207",
    icon: "🥔",
    description: "Raiz rica em carboidratos"
  },
  {
    id: "16",
    name: "Arroz",
    category: "grains",
    spacing: "20x20cm",
    color: "#f5f5f4",
    icon: "🌾",
    description: "Cereal aquático básico"
  },
  {
    id: "17",
    name: "Camomila",
    category: "medicinal",
    spacing: "20x20cm",
    color: "#fbbf24",
    icon: "🌼",
    description: "Flor calmante medicinal"
  },
  {
    id: "18",
    name: "Gengibre",
    category: "medicinal",
    spacing: "40x30cm",
    color: "#d97706",
    icon: "🫚",
    description: "Rizoma anti-inflamatório"
  },
  {
    id: "19",
    name: "Pimentão",
    category: "vegetables",
    spacing: "50x40cm",
    color: "#ef4444",
    icon: "🫑",
    description: "Fruto rico em vitamina C"
  },
  {
    id: "20",
    name: "Limão",
    category: "fruits",
    spacing: "5x5m",
    color: "#eab308",
    icon: "🍋",
    description: "Cítrico ácido versátil"
  }
];
