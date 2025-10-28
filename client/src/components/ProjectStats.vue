<template>
  <div
    class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20"
  >
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
      <Icon icon="mdi:chart-bar" class="w-6 h-6" />
      Estatísticas do Projeto
    </h3>

    <div class="grid grid-cols-2 gap-4">
      <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ plantCount }}</div>
        <div
          class="text-sm text-green-700 dark:text-green-300 flex items-center justify-center gap-1"
        >
          <Icon icon="mdi:sprout" class="w-4 h-4" />
          Plantas
        </div>
      </div>

      <div class="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {{ terrainCount }}
        </div>
        <div
          class="text-sm text-orange-700 dark:text-orange-300 flex items-center justify-center gap-1"
        >
          <Icon icon="mdi:terrain" class="w-4 h-4" />
          Terrenos
        </div>
      </div>

      <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ structureCount }}</div>
        <div
          class="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1"
        >
          <Icon icon="mdi:office-building" class="w-4 h-4" />
          Estruturas
        </div>
      </div>

      <div class="text-center p-3 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
        <div class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ totalElements }}</div>
        <div
          class="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1"
        >
          <Icon icon="mdi:package-variant" class="w-4 h-4" />
          Total
        </div>
      </div>
    </div>

    <div
      v-if="totalElements > 0"
      class="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg"
    >
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">Distribuição:</div>
      <div class="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div
          v-if="plantCount > 0"
          class="bg-green-400 transition-all duration-300"
          :style="{ width: `${(plantCount / totalElements) * 100}%` }"
        ></div>
        <div
          v-if="terrainCount > 0"
          class="bg-orange-400 transition-all duration-300"
          :style="{ width: `${(terrainCount / totalElements) * 100}%` }"
        ></div>
        <div
          v-if="structureCount > 0"
          class="bg-blue-400 transition-all duration-300"
          :style="{ width: `${(structureCount / totalElements) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { CanvasElement } from '@/types/canvas'

interface Props {
  elements: CanvasElement[]
}

const props = defineProps<Props>()

const plantCount = computed(() => props.elements.filter(el => el.type === 'plant').length)

const terrainCount = computed(() => props.elements.filter(el => el.type === 'terrain').length)

const structureCount = computed(() => props.elements.filter(el => el.type === 'structure').length)

const totalElements = computed(() => props.elements.length)
</script>
