<template>
  <div v-if="isEmpty" class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div class="text-center space-y-4 opacity-50">
      <Icon icon="mdi:sprout" class="w-20 h-20 mx-auto text-green-500" />
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Comece a Planejar</h3>
      <p class="text-gray-500 dark:text-gray-400">
        Selecione uma ferramenta e elemento da biblioteca
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  isEmpty: boolean
}

defineProps<Props>()
</script>
