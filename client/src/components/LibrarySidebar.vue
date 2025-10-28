<template>
  <div class="h-full flex flex-col p-6">
    <!-- Library Tabs -->
    <div class="space-y-3 mb-6">
      <div class="flex gap-2">
        <button
          v-for="library in mainLibraries"
          :key="library.id"
          @click="$emit('library-change', library.id)"
          :class="[
            'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200',
            activeLibrary === library.id
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105'
              : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/60 hover:scale-105',
          ]"
        >
          <Icon :icon="library.icon" class="w-5 h-5" />
          <span class="text-sm">{{ library.name }}</span>
        </button>
      </div>

      <div class="flex justify-center">
        <button
          @click="$emit('library-change', 'structures')"
          :class="[
            'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200',
            activeLibrary === 'structures'
              ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/60 hover:scale-105',
          ]"
        >
          <Icon icon="mdi:office-building" class="w-5 h-5" />
          <span class="text-sm">Estruturas</span>
        </button>
      </div>
    </div>

    <!-- Library Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Plants Library -->
      <div v-if="activeLibrary === 'plants'" class="space-y-4">
        <div class="flex items-center gap-3 mb-4">
          <Icon icon="mdi:leaf" class="w-7 h-7 text-green-500" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Plantas</h3>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="plant in plants"
            :key="plant.id"
            @click="$emit('plant-select', plant)"
            :class="[
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              selectedPlant?.id === plant.id
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20 scale-105 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 hover:border-green-300 hover:scale-105 hover:shadow-md',
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
              <span class="font-medium text-sm text-gray-800 dark:text-gray-200">{{
                plant.name
              }}</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ plant.category }}</p>
          </button>
        </div>
      </div>

      <!-- Terrain Library -->
      <div v-if="activeLibrary === 'terrain'" class="space-y-4">
        <div class="flex items-center gap-3 mb-4">
          <Icon icon="mdi:terrain" class="w-7 h-7 text-orange-500" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Terrenos</h3>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="terrain in terrains"
            :key="terrain.id"
            @click="$emit('terrain-select', terrain)"
            :class="[
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              selectedTerrain?.id === terrain.id
                ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 scale-105 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 hover:border-orange-300 hover:scale-105 hover:shadow-md',
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full bg-orange-400"></div>
              <span class="font-medium text-sm text-gray-800 dark:text-gray-200">{{
                terrain.name
              }}</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ terrain.type }}</p>
          </button>
        </div>
      </div>

      <!-- Structures Library -->
      <div v-if="activeLibrary === 'structures'" class="space-y-4">
        <div class="flex items-center gap-3 mb-4">
          <Icon icon="mdi:office-building" class="w-7 h-7 text-blue-500" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Estruturas</h3>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="structure in structures"
            :key="structure.id"
            @click="$emit('structure-select', structure)"
            :class="[
              'p-4 rounded-xl border-2 transition-all duration-200 text-left',
              selectedStructure?.id === structure.id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 hover:border-blue-300 hover:scale-105 hover:shadow-md',
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 rounded-full bg-blue-400"></div>
              <span class="font-medium text-sm text-gray-800 dark:text-gray-200">{{
                structure.name
              }}</span>
            </div>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ structure.type }}</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Selected Item Info -->
    <div
      v-if="selectedItem"
      class="mt-6 p-4 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/20"
    >
      <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ selectedItem.name }}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ selectedItem.description }}</p>
      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
        <div :class="['w-2 h-2 rounded-full', getItemColor(selectedItem)]"></div>
        <span>Clique no canvas para adicionar</span>
      </div>
    </div>

    <!-- Project Stats -->
    <div class="mt-6">
      <ProjectStats :elements="elements" />
    </div>

    <!-- Advanced Settings -->
    <div class="mt-6">
      <AdvancedSettings
        :show-grid="showGrid"
        :zoom="zoom"
        @toggle-grid="$emit('toggle-grid')"
        @zoom-in="$emit('zoom-in')"
        @zoom-out="$emit('zoom-out')"
        @zoom-change="$emit('zoom-change', $event)"
        @clear-canvas="$emit('clear-canvas')"
        @reset-view="$emit('reset-view')"
        @export-png="$emit('export-png')"
        @export-json="$emit('export-json')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { Plant, Terrain, Structure, CanvasElement } from '@/types/canvas'
import ProjectStats from './ProjectStats.vue'
import AdvancedSettings from './AdvancedSettings.vue'

interface Props {
  activeLibrary: 'plants' | 'terrain' | 'structures'
  selectedPlant: Plant | null
  selectedTerrain: Terrain | null
  selectedStructure: Structure | null
  elements: CanvasElement[]
  showGrid: boolean
  zoom: number
}

const props = defineProps<Props>()

defineEmits<{
  'library-change': [library: 'plants' | 'terrain' | 'structures']
  'plant-select': [plant: Plant]
  'terrain-select': [terrain: Terrain]
  'structure-select': [structure: Structure]
  'toggle-grid': []
  'zoom-in': []
  'zoom-out': []
  'zoom-change': [zoom: number]
  'clear-canvas': []
  'reset-view': []
  'export-png': []
  'export-json': []
}>()

const mainLibraries = [
  { id: 'plants', name: 'Plantas', icon: 'mdi:leaf' },
  { id: 'terrain', name: 'Terreno', icon: 'mdi:terrain' },
]

const selectedItem = computed(() => {
  return props.selectedPlant || props.selectedTerrain || props.selectedStructure
})

const getItemColor = (item: any) => {
  if (props.selectedPlant) return 'bg-green-400'
  if (props.selectedTerrain) return 'bg-orange-400'
  if (props.selectedStructure) return 'bg-blue-400'
  return 'bg-gray-400'
}

// Mock data - replace with real data
const plants: Plant[] = [
  {
    id: '1',
    name: 'Tomate',
    category: 'Fruto',
    description: 'Planta de tomate para horta doméstica',
  },
  {
    id: '2',
    name: 'Alface',
    category: 'Folhosa',
    description: 'Verdura folhosa de crescimento rápido',
  },
  { id: '3', name: 'Cenoura', category: 'Raiz', description: 'Raiz comestível rica em vitamina A' },
  { id: '4', name: 'Pimentão', category: 'Fruto', description: 'Pimento doce colorido' },
  { id: '5', name: 'Couve', category: 'Folhosa', description: 'Verdura resistente e nutritiva' },
  { id: '6', name: 'Beterraba', category: 'Raiz', description: 'Raiz doce e colorida' },
]

const terrains: Terrain[] = [
  {
    id: '1',
    name: 'Solo Fértil',
    type: 'Orgânico',
    description: 'Solo rico em nutrientes e matéria orgânica',
  },
  {
    id: '2',
    name: 'Solo Arenoso',
    type: 'Drenagem',
    description: 'Solo com boa drenagem, ideal para raízes',
  },
  {
    id: '3',
    name: 'Solo Argiloso',
    type: 'Retenção',
    description: 'Solo que retém bem a água e nutrientes',
  },
  {
    id: '4',
    name: 'Compostagem',
    type: 'Enriquecido',
    description: 'Área para compostagem e enriquecimento',
  },
]

const structures: Structure[] = [
  {
    id: '1',
    name: 'Estufa',
    type: 'Proteção',
    description: 'Estrutura para proteção contra intempéries',
  },
  {
    id: '2',
    name: 'Cerca',
    type: 'Delimitação',
    description: 'Delimitação e proteção da área de cultivo',
  },
  {
    id: '3',
    name: 'Irrigação',
    type: 'Sistema',
    description: 'Sistema de irrigação por gotejamento',
  },
  {
    id: '4',
    name: 'Composteira',
    type: 'Processamento',
    description: 'Estrutura para compostagem de resíduos',
  },
]
</script>
