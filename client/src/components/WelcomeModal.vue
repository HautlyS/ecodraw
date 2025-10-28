<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click="$emit('close')"
    >
      <div class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-8" @click.stop>
        <!-- Header -->
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-4xl"
          >
            <Icon icon="mdi:sprout" class="w-10 h-10" />
          </div>
          <h2
            class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400 mb-2"
          >
            Bem-vindo ao Agroecologia Planner!
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            Sua ferramenta para planejar projetos de agroecologia sustentável
          </p>
        </div>

        <!-- Features -->
        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0 text-lg"
            >
              <Icon icon="mdi:sprout" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200">Planeje suas culturas</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Adicione diferentes tipos de plantas ao seu projeto
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0 text-lg"
            >
              <Icon icon="mdi:terrain" class="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200">Defina o terreno</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Configure diferentes tipos de solo e áreas
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 text-lg"
            >
              <Icon icon="mdi:office-building" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 dark:text-gray-200">Adicione estruturas</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Inclua estufas, cercas e sistemas de irrigação
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Começar Agora
          </button>
          <button
            @click="$emit('close')"
            class="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  show: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>
