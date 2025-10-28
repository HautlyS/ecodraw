<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 pointer-events-none">
      <!-- Modern Minimizable Library -->
      <div
        ref="windowElement"
        :style="{
          left: windowPosition.x + 'px',
          bottom: '0px',
          width: windowSize.width + 'px',
          height: isMinimized ? '60px' : windowSize.height + 'px',
        }"
        :class="[
          'absolute bg-white dark:bg-gray-900 rounded-t-xl border-t border-x border-gray-200 dark:border-gray-700 shadow-2xl pointer-events-auto transition-all duration-300 ease-in-out flex flex-col',
          isMinimized ? 'hover:h-[600px]' : '',
        ]"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousedown.stop
      >
        <!-- Modern Header Bar -->
        <div
          ref="headerElement"
          class="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 cursor-pointer select-none"
          @click="toggleMinimize"
        >
          <div class="flex items-center gap-4">
            <Icon icon="mdi:library" class="w-6 h-6 text-white" />
            <div>
              <h2 class="text-base font-bold text-white">Biblioteca de Elementos</h2>
              <div class="text-xs text-amber-100">
                {{ getItemCount(activeCategory) }} elementos disponíveis
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-xs text-amber-100 font-medium">
              {{ isMinimized ? 'Clique para expandir' : 'Clique para minimizar' }}
            </div>
            <Icon
              :icon="isMinimized ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="w-6 h-6 text-white transition-transform duration-300"
            />
          </div>
        </div>
        <!-- Search and Category Tabs -->
        <div
          v-show="!isMinimized"
          class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          <!-- Search Bar -->
          <div class="p-4 pb-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar elementos..."
                class="w-full px-4 py-2.5 pl-10 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="mdi:magnify" class="w-5 h-5 text-gray-400" />
              </div>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Icon icon="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Category Tabs -->
          <div class="flex gap-2 px-4 pb-4">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm',
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-gray-600',
              ]"
            >
              <Icon :icon="category.icon" class="w-5 h-5" />
              <span>{{ category.name }}</span>
              <span class="text-xs opacity-75 bg-black/10 px-2 py-0.5 rounded-full"
                >({{ getFilteredItemCount(category.id) }})</span
              >
            </button>
          </div>
        </div>

        <!-- Clean Content -->
        <!-- Modern Content with Responsive Grid -->
        <div
          v-show="!isMinimized"
          class="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
        >
          <!-- Plantas -->
          <div v-if="activeCategory === 'plants'">
            <div v-if="filteredPlants.length === 0" class="text-center py-16">
              <Icon
                icon="mdi:sprout"
                class="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              />
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhuma planta encontrada
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Tente ajustar os termos de busca
              </p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
              <div
                v-for="plant in filteredPlants"
                :key="plant.id"
                :draggable="true"
                @dragstart="startElementDrag(plant, 'plant', $event)"
                @click="selectAndUseElement(plant, 'plant')"
                :class="[
                  'group p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-grab active:cursor-grabbing hover:scale-105',
                  selectedElement?.id === plant.id && selectedElementType === 'plant'
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 shadow-lg ring-4 ring-green-200 dark:ring-green-800/50'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-500 hover:shadow-xl',
                ]"
              >
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm"
                  ></div>
                  <span class="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {{ plant.name }}
                  </span>
                </div>
                <div class="mb-2">
                  <span
                    class="inline-block px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded-full"
                  >
                    {{ plant.category }}
                  </span>
                </div>
                <p
                  class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]"
                >
                  {{ plant.description }}
                </p>
                <div class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span
                    class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
                  >
                    <Icon icon="mdi:diameter" class="w-3 h-3" />
                    {{ plant.canopyDiameterMeters }}m
                  </span>
                  <span
                    class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
                  >
                    <Icon icon="mdi:arrow-expand-vertical" class="w-3 h-3" />
                    {{ plant.heightMeters }}m
                  </span>
                  <span
                    class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
                  >
                    <Icon icon="mdi:arrow-expand-horizontal" class="w-3 h-3" />
                    {{ plant.spacingMeters }}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Terrenos -->
          <div v-if="activeCategory === 'terrain'">
            <div v-if="filteredTerrains.length === 0" class="text-center py-16">
              <Icon
                icon="mdi:terrain"
                class="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              />
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhum terreno encontrado
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Tente ajustar os termos de busca
              </p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
              <div
                v-for="terrain in filteredTerrains"
                :key="terrain.id"
                :draggable="true"
                @dragstart="startElementDrag(terrain, 'terrain', $event)"
                @click="selectAndUseElement(terrain, 'terrain')"
                :class="[
                  'group p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-grab active:cursor-grabbing hover:scale-105',
                  selectedElement?.id === terrain.id && selectedElementType === 'terrain'
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 shadow-lg ring-4 ring-green-200 dark:ring-green-800/50'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-500 hover:shadow-xl',
                ]"
              >
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm"
                  ></div>
                  <span class="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {{ terrain.name }}
                  </span>
                </div>
                <div class="mb-2">
                  <span
                    class="inline-block px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 rounded-full"
                  >
                    {{ terrain.type }}
                  </span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                  {{ terrain.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Estruturas -->
          <div v-if="activeCategory === 'structures'">
            <div v-if="filteredStructures.length === 0" class="text-center py-16">
              <Icon
                icon="mdi:office-building"
                class="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              />
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhuma estrutura encontrada
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Tente ajustar os termos de busca
              </p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
              <div
                v-for="structure in filteredStructures"
                :key="structure.id"
                :draggable="true"
                @dragstart="startElementDrag(structure, 'structure', $event)"
                @click="selectAndUseElement(structure, 'structure')"
                :class="[
                  'group p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-grab active:cursor-grabbing hover:scale-105',
                  selectedElement?.id === structure.id && selectedElementType === 'structure'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 shadow-lg ring-4 ring-blue-200 dark:ring-blue-800/50'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl',
                ]"
              >
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm"
                  ></div>
                  <span class="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {{ structure.name }}
                  </span>
                </div>
                <div class="mb-2">
                  <span
                    class="inline-block px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 rounded-full"
                  >
                    {{ structure.type }}
                  </span>
                </div>
                <p
                  class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]"
                >
                  {{ structure.description }}
                </p>
                <div class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span
                    class="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
                  >
                    <Icon icon="mdi:ruler-square" class="w-3 h-3" />
                    {{ structure.widthMeters }}m × {{ structure.heightMeters }}m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Footer -->
        <div
          v-show="!isMinimized"
          class="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <Icon icon="mdi:information-outline" class="w-4 h-4 inline mr-1" />
            Clique para usar ou arraste para o canvas
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-500">
            {{
              filteredPlants.length + filteredTerrains.length + filteredStructures.length
            }}
            elementos
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { Plant, Terrain, Structure } from '@/types/canvas'
import {
  ENHANCED_PLANTS,
  ENHANCED_TERRAINS,
  ENHANCED_STRUCTURES,
  getElementIcon,
} from '@/data/elements'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'element-select': [element: Plant | Terrain | Structure, type: 'plant' | 'terrain' | 'structure']
  'element-drag': [
    element: Plant | Terrain | Structure,
    type: 'plant' | 'terrain' | 'structure',
    event: DragEvent,
  ]
}>()

const activeCategory = ref<'plants' | 'terrain' | 'structures'>('plants')
const selectedElement = ref<Plant | Terrain | Structure | null>(null)
const selectedElementType = ref<'plant' | 'terrain' | 'structure' | null>(null)
const searchQuery = ref('')

// Window state
const windowElement = ref<HTMLElement>()
const headerElement = ref<HTMLElement>()
const windowPosition = ref({ x: 10, y: 0 })
const windowSize = ref({ width: 520, height: 500 })
const isMinimized = ref(true)
const hoverTimeout = ref<number | null>(null)

const categories = [
  { id: 'plants', name: 'Plantas', icon: 'mdi:leaf' },
  { id: 'terrain', name: 'Terrenos', icon: 'mdi:terrain' },
  { id: 'structures', name: 'Estruturas', icon: 'mdi:office-building' },
]

// Mock data with real-life dimensions and colors
const plants: Plant[] = [
  {
    id: '1',
    name: 'Tomate',
    category: 'Fruto',
    description: 'Planta de tomate para horta doméstica, rica em licopeno',
    spacingMeters: 0.5,
    canopyDiameterMeters: 0.6,
    heightMeters: 1.5,
    color: '#ef4444', // Red
  },
  {
    id: '2',
    name: 'Alface',
    category: 'Folhosa',
    description: 'Verdura folhosa de crescimento rápido, ideal para saladas',
    spacingMeters: 0.3,
    canopyDiameterMeters: 0.3,
    heightMeters: 0.3,
    color: '#84cc16', // Lime green
  },
  {
    id: '3',
    name: 'Cenoura',
    category: 'Raiz',
    description: 'Raiz comestível rica em vitamina A e betacaroteno',
    spacingMeters: 0.1,
    canopyDiameterMeters: 0.15,
    heightMeters: 0.3,
    color: '#f97316', // green
  },
  {
    id: '4',
    name: 'Pimentão',
    category: 'Fruto',
    description: 'Pimento doce colorido, rico em vitamina C',
    spacingMeters: 0.5,
    canopyDiameterMeters: 0.5,
    heightMeters: 0.8,
    color: '#eab308', // Yellow
  },
  {
    id: '5',
    name: 'Couve',
    category: 'Folhosa',
    description: 'Verdura resistente e nutritiva, fonte de ferro',
    spacingMeters: 0.5,
    canopyDiameterMeters: 0.6,
    heightMeters: 0.6,
    color: '#16a34a', // Dark green
  },
  {
    id: '6',
    name: 'Beterraba',
    category: 'Raiz',
    description: 'Raiz doce e colorida, rica em folato',
    spacingMeters: 0.15,
    canopyDiameterMeters: 0.2,
    heightMeters: 0.3,
    color: '#dc2626', // Dark red
  },
  {
    id: '7',
    name: 'Manjericão',
    category: 'Erva',
    description: 'Erva aromática para temperos e chás',
    spacingMeters: 0.25,
    canopyDiameterMeters: 0.3,
    heightMeters: 0.5,
    color: '#22c55e', // Green
  },
  {
    id: '8',
    name: 'Salsa',
    category: 'Erva',
    description: 'Erva versátil para temperos e decoração',
    spacingMeters: 0.2,
    canopyDiameterMeters: 0.25,
    heightMeters: 0.3,
    color: '#10b981', // Emerald
  },
  {
    id: '9',
    name: 'Rúcula',
    category: 'Folhosa',
    description: 'Folha picante ideal para saladas gourmet',
    spacingMeters: 0.15,
    canopyDiameterMeters: 0.2,
    heightMeters: 0.2,
    color: '#65a30d', // Lime
  },
  {
    id: '10',
    name: 'Espinafre',
    category: 'Folhosa',
    description: 'Verdura rica em ferro e vitaminas',
    spacingMeters: 0.15,
    canopyDiameterMeters: 0.2,
    heightMeters: 0.3,
    color: '#15803d', // Forest green
  },
  {
    id: '11',
    name: 'Laranjeira',
    category: 'Árvore Frutífera',
    description: 'Árvore cítrica produtora de laranjas',
    spacingMeters: 5,
    canopyDiameterMeters: 4,
    heightMeters: 6,
    color: '#fb923c', // green
  },
  {
    id: '12',
    name: 'Limoeiro',
    category: 'Árvore Frutífera',
    description: 'Árvore cítrica produtora de limões',
    spacingMeters: 4,
    canopyDiameterMeters: 3,
    heightMeters: 5,
    color: '#facc15', // Yellow
  },
  {
    id: '13',
    name: 'Bananeira',
    category: 'Árvore Frutífera',
    description: 'Planta tropical produtora de bananas',
    spacingMeters: 3,
    canopyDiameterMeters: 2.5,
    heightMeters: 4,
    color: '#fde047', // Light yellow
  },
  {
    id: '14',
    name: 'Abacateiro',
    category: 'Árvore Frutífera',
    description: 'Árvore produtora de abacates',
    spacingMeters: 8,
    canopyDiameterMeters: 6,
    heightMeters: 10,
    color: '#166534', // Dark green
  },
]

const terrains: Terrain[] = [
  {
    id: '1',
    name: 'Solo Fértil',
    type: 'Orgânico',
    description: 'Solo rico em nutrientes e matéria orgânica, ideal para a maioria das culturas',
    color: '#78350f', // Brown
  },
  {
    id: '2',
    name: 'Solo Arenoso',
    type: 'Drenagem',
    description: 'Solo com boa drenagem, ideal para plantas que não toleram encharcamento',
    color: '#fbbf24', // Amber
  },
  {
    id: '3',
    name: 'Solo Argiloso',
    type: 'Retenção',
    description:
      'Solo que retém bem a água e nutrientes, ideal para plantas que precisam de mais umidade',
    color: '#92400e', // Dark brown
  },
  {
    id: '4',
    name: 'Compostagem',
    type: 'Enriquecido',
    description: 'Área para compostagem e enriquecimento do solo com matéria orgânica',
    color: '#65a30d', // Lime
  },
  {
    id: '5',
    name: 'Solo Calcário',
    type: 'Alcalino',
    description: 'Solo com pH elevado, ideal para plantas que preferem ambiente alcalino',
    color: '#d6d3d1', // Stone
  },
  {
    id: '6',
    name: 'Solo Ácido',
    type: 'Ácido',
    description: 'Solo com pH baixo, ideal para plantas acidófilas',
    color: '#b45309', // green brown
  },
]

const structures: Structure[] = [
  {
    id: '1',
    name: 'Estufa',
    type: 'Proteção',
    description: 'Estrutura para proteção contra intempéries e controle climático',
    widthMeters: 6,
    heightMeters: 4,
    lengthMeters: 10,
    color: '#06b6d4', // Cyan
  },
  {
    id: '2',
    name: 'Cerca',
    type: 'Delimitação',
    description: 'Delimitação e proteção da área de cultivo contra animais',
    widthMeters: 0.1,
    heightMeters: 2,
    color: '#78716c', // Stone
  },
  {
    id: '3',
    name: 'Sistema de Irrigação',
    type: 'Sistema',
    description: 'Sistema de irrigação por gotejamento para economia de água',
    widthMeters: 1,
    heightMeters: 1,
    color: '#0ea5e9', // Sky blue
  },
  {
    id: '4',
    name: 'Composteira',
    type: 'Processamento',
    description: 'Estrutura para compostagem de resíduos orgânicos',
    widthMeters: 1.5,
    heightMeters: 1.5,
    color: '#a16207', // Yellow brown
  },
  {
    id: '5',
    name: 'Pergolado',
    type: 'Suporte',
    description: 'Estrutura de suporte para plantas trepadeiras',
    widthMeters: 3,
    heightMeters: 2.5,
    color: '#92400e', // Brown
  },
  {
    id: '6',
    name: 'Canteiro Elevado',
    type: 'Cultivo',
    description: 'Canteiro elevado para melhor drenagem e ergonomia',
    widthMeters: 1.2,
    heightMeters: 3,
    color: '#854d0e', // Amber brown
  },
  {
    id: '7',
    name: 'Reservatório',
    type: 'Armazenamento',
    description: 'Reservatório para armazenamento de água da chuva',
    widthMeters: 2,
    heightMeters: 2,
    color: '#0284c7', // Blue
  },
  {
    id: '8',
    name: 'Galpão',
    type: 'Armazenamento',
    description: 'Galpão para armazenamento de ferramentas e equipamentos',
    widthMeters: 4,
    heightMeters: 5,
    color: '#57534e', // Stone gray
  },
  {
    id: '9',
    name: 'Casa',
    type: 'Edificação',
    description: 'Casa residencial',
    widthMeters: 10,
    heightMeters: 8,
    color: '#dc2626', // Red
  },
  {
    id: '10',
    name: 'Galinheiro',
    type: 'Criação',
    description: 'Estrutura para criação de galinhas',
    widthMeters: 3,
    heightMeters: 2,
    color: '#ea580c', // green
  },
]

const getItemCount = (categoryId: string) => {
  switch (categoryId) {
    case 'plants':
      return plants.length
    case 'terrain':
      return terrains.length
    case 'structures':
      return structures.length
    default:
      return 0
  }
}

const getFilteredItemCount = (categoryId: string) => {
  if (!searchQuery.value) return getItemCount(categoryId)

  switch (categoryId) {
    case 'plants':
      return filteredPlants.value.length
    case 'terrain':
      return filteredTerrains.value.length
    case 'structures':
      return filteredStructures.value.length
    default:
      return 0
  }
}

// Computed filtered arrays
const filteredPlants = computed(() => {
  if (!searchQuery.value) return plants
  const query = searchQuery.value.toLowerCase()
  return plants.filter(
    plant =>
      plant.name.toLowerCase().includes(query) ||
      plant.category.toLowerCase().includes(query) ||
      plant.description.toLowerCase().includes(query)
  )
})

const filteredTerrains = computed(() => {
  if (!searchQuery.value) return terrains
  const query = searchQuery.value.toLowerCase()
  return terrains.filter(
    terrain =>
      terrain.name.toLowerCase().includes(query) ||
      terrain.type.toLowerCase().includes(query) ||
      terrain.description.toLowerCase().includes(query)
  )
})

const filteredStructures = computed(() => {
  if (!searchQuery.value) return structures
  const query = searchQuery.value.toLowerCase()
  return structures.filter(
    structure =>
      structure.name.toLowerCase().includes(query) ||
      structure.type.toLowerCase().includes(query) ||
      structure.description.toLowerCase().includes(query)
  )
})

const getElementColor = () => {
  if (selectedElementType.value === 'plant') return 'bg-green-500'
  if (selectedElementType.value === 'terrain') return 'bg-green-500'
  if (selectedElementType.value === 'structure') return 'bg-blue-500'
  return 'bg-gray-400'
}

const selectAndUseElement = (
  element: Plant | Terrain | Structure,
  type: 'plant' | 'terrain' | 'structure'
) => {
  selectedElement.value = element
  selectedElementType.value = type
  emit('element-select', element, type)
}

// Window management - Minimize/Expand on hover
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value
}

const handleMouseEnter = () => {
  if (isMinimized.value) {
    // Clear any existing timeout
    if (hoverTimeout.value) {
      clearTimeout(hoverTimeout.value)
    }
    // Expand after a short delay
    hoverTimeout.value = window.setTimeout(() => {
      isMinimized.value = false
    }, 200)
  }
}

const handleMouseLeave = () => {
  // Clear hover timeout if mouse leaves before expansion
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
    hoverTimeout.value = null
  }
  // Auto-minimize after leaving
  setTimeout(() => {
    if (!isMinimized.value) {
      isMinimized.value = true
    }
  }, 500)
}

// Element drag and drop
const startElementDrag = (
  element: Plant | Terrain | Structure,
  type: 'plant' | 'terrain' | 'structure',
  event: DragEvent
) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify({ element, type }))
    event.dataTransfer.effectAllowed = 'copy'
  }
  emit('element-drag', element, type, event)
}

const confirmSelection = () => {
  if (selectedElement.value && selectedElementType.value) {
    emit('element-select', selectedElement.value, selectedElementType.value)
    closeModal()
  }
}

// Element selection
const selectElement = (
  element: Plant | Terrain | Structure,
  type: 'plant' | 'terrain' | 'structure'
) => {
  selectedElement.value = element
  selectedElementType.value = type
}

// Initialize window position at bottom
onMounted(() => {
  // Fixed width for 2 columns (optimal for element cards)
  const width = 520 // Perfect for 2 columns with padding
  windowSize.value = { width, height: 500 }
  windowPosition.value = {
    x: 10, // Left side
    y: 0,
  }
})

onUnmounted(() => {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
