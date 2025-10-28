<template>
  <div
    class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/20 p-4"
  >
    <div class="flex items-center justify-between">
      <!-- Tools -->
      <div class="flex gap-2">
        <button
          v-for="tool in tools"
          :key="tool.id"
          @click="$emit('tool-select', tool.id)"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            selectedTool === tool.id
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
              : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/60',
          ]"
        >
          <Icon :icon="tool.icon" class="w-5 h-5" />
          <span>{{ tool.name }}</span>
        </button>
      </div>

      <!-- Library Button -->
      <button
        @click="$emit('show-library')"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium shadow-lg"
      >
        <Icon icon="mdi:library" class="w-5 h-5" />
        <span>Biblioteca</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  selectedTool: string
  activeLibrary: 'plants' | 'terrain' | 'structures'
}

defineProps<Props>()

defineEmits<{
  'tool-select': [tool: string]
  'library-change': [library: 'plants' | 'terrain' | 'structures']
  'show-library': []
}>()

const tools = [
  { id: 'select', name: 'Sel', icon: 'mdi:cursor-default-click' },
  { id: 'plant', name: 'Planta', icon: 'mdi:sprout' },
  { id: 'terrain', name: 'Terreno', icon: 'mdi:terrain' },
  { id: 'structure', name: 'Estrutura', icon: 'mdi:office-building' },
]
</script>
