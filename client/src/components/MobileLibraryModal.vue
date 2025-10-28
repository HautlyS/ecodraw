<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Modal -->
      <div
        class="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg"
            >
              <Icon icon="mdi:library" class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Element Library</h2>
          </div>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <Icon icon="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[60vh]">
          <LibrarySidebar
            :active-library="activeLibrary"
            @library-change="$emit('library-change', $event)"
            :selected-plant="selectedPlant"
            @plant-select="handlePlantSelect"
            :selected-terrain="selectedTerrain"
            @terrain-select="handleTerrainSelect"
            :selected-structure="selectedStructure"
            @structure-select="handleStructureSelect"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import LibrarySidebar from './LibrarySidebar.vue'
import type { Plant, Terrain, Structure } from '@/types/canvas'

interface Props {
  show: boolean
  activeLibrary: 'plants' | 'terrain' | 'structures'
  selectedPlant: Plant | null
  selectedTerrain: Terrain | null
  selectedStructure: Structure | null
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  'library-change': [library: 'plants' | 'terrain' | 'structures']
  'plant-select': [plant: Plant]
  'terrain-select': [terrain: Terrain]
  'structure-select': [structure: Structure]
}>()

const handlePlantSelect = (plant: Plant) => {
  emit('plant-select', plant)
  emit('close')
}

const handleTerrainSelect = (terrain: Terrain) => {
  emit('terrain-select', terrain)
  emit('close')
}

const handleStructureSelect = (structure: Structure) => {
  emit('structure-select', structure)
  emit('close')
}
</script>
