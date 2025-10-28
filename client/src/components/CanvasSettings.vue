<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

    <!-- Settings Modal -->
    <div
      class="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg"
          >
            <Icon icon="mdi:ruler-square" class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
              - PRESETS - PERSONAL --- SETTINGS ---------
            </h2>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Configure canvas size, grid, and display settings
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all hover:scale-110"
        >
          <Icon icon="mdi:close" class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Agroecological Presets -->
        <div
          class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-5 border border-green-200 dark:border-green-800"
        >
          <div class="flex items-center gap-2 mb-4">
            <Icon icon="mdi:sprout" class="w-6 h-6 text-green-600 dark:text-green-400" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Presets Agroecológicos</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Quick presets for common agroecological garden sizes
          </p>

          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="preset in agroPresets"
              :key="preset.name"
              :data-preset="preset.name"
              @click="applyPreset(preset)"
              class="p-4 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all group bg-white dark:bg-gray-900"
            >
              <div class="flex items-center gap-2 mb-2">
                <Icon
                  :icon="preset.icon"
                  class="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"
                />
                <div class="font-bold text-sm text-gray-900 dark:text-white">{{ preset.name }}</div>
              </div>
              <div class="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                {{ preset.width }}m × {{ preset.height }}m
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400">{{ preset.area }}m²</div>
              <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {{ preset.description }}
              </div>
            </button>
          </div>
        </div>

        <!-- Real-life Dimensions -->
        <div
          class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800"
        >
          <div class="flex items-center gap-2 mb-4">
            <Icon icon="mdi:resize" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Dimensões Personalizadas
            </h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Define custom canvas dimensions independently (width and height are separate)
          </p>

          <div class="space-y-4 mb-4">
            <!-- Width Control -->
            <div
              class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <label
                class="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"
              >
                <Icon icon="mdi:arrow-left-right" class="w-4 h-4 text-blue-600" />
                Width (Largura)
              </label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="localSettings.widthMeters"
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  v-model.number="localSettings.widthMeters"
                  type="number"
                  min="5"
                  max="1000"
                  step="5"
                  class="w-20 px-3 py-2 text-center text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                />
                <span class="text-lg font-bold text-gray-600 dark:text-gray-400">m</span>
              </div>
            </div>

            <!-- Height Control -->
            <div
              class="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <label
                class="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3"
              >
                <Icon icon="mdi:arrow-up-down" class="w-4 h-4 text-blue-600" />
                Height (Altura)
              </label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="localSettings.heightMeters"
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  v-model.number="localSettings.heightMeters"
                  type="number"
                  min="5"
                  max="1000"
                  step="5"
                  class="w-20 px-3 py-2 text-center text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                />
                <span class="text-lg font-bold text-gray-600 dark:text-gray-400">m</span>
              </div>
            </div>
          </div>

          <div
            class="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-700"
          >
            <div class="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                class="w-5 h-5 text-blue-700 dark:text-blue-400 mt-0.5"
              />
              <div class="text-sm text-blue-900 dark:text-blue-200">
                <div class="font-bold mb-2">Canvas Information:</div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">Scale:</span>
                    <span>1 meter = {{ pixelsPerMeter }} pixels</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">Dimensions:</span>
                    <span class="font-bold"
                      >{{ localSettings.widthMeters }}m × {{ localSettings.heightMeters }}m</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="font-medium">Total Area:</span>
                    <span class="font-bold text-lg"
                      >{{
                        (localSettings.widthMeters * localSettings.heightMeters).toLocaleString()
                      }}m²</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Settings -->
        <div>
          <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-4">Grid Settings</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grid Size (meters)
              </label>
              <select
                v-model.number="localSettings.gridSizeMeters"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option :value="0.5">0.5m (50cm)</option>
                <option :value="1">1m</option>
                <option :value="2">2m</option>
                <option :value="5">5m</option>
                <option :value="10">10m</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Grid
              </label>
              <button
                @click="localSettings.showGrid = !localSettings.showGrid"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  localSettings.showGrid ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    localSettings.showGrid ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Snap to Grid
              </label>
              <button
                @click="localSettings.snapToGrid = !localSettings.snapToGrid"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  localSettings.snapToGrid ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    localSettings.snapToGrid ? 'translate-x-6' : 'translate-x-1',
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      >
        <button
          @click="resetToDefaults"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
        >
          Reset to Defaults
        </button>
        <div class="flex gap-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="applySettings"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

export interface CanvasSettings {
  widthMeters: number
  heightMeters: number
  gridSizeMeters: number
  showGrid: boolean
  snapToGrid: boolean
}

interface Props {
  show: boolean
  settings: CanvasSettings
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  update: [settings: CanvasSettings]
}>()

const localSettings = ref<CanvasSettings>({ ...props.settings })
const pixelsPerMeter = 20 // 1 meter = 20 pixels

// Agroecological Garden Presets
const agroPresets = [
  {
    name: 'Horta Doméstica',
    icon: 'mdi:home-variant',
    width: 10,
    height: 15,
    area: 150,
    description: 'Pequena horta familiar',
  },
  {
    name: 'Horta Comunitária',
    icon: 'mdi:account-group',
    width: 25,
    height: 30,
    area: 750,
    description: 'Horta para comunidade',
  },
  {
    name: 'Sítio Pequeno',
    icon: 'mdi:barn',
    width: 50,
    height: 80,
    area: 4000,
    description: 'Propriedade rural pequena',
  },
  {
    name: 'Fazenda Média',
    icon: 'mdi:tractor',
    width: 100,
    height: 150,
    area: 15000,
    description: 'Produção em escala',
  },
  {
    name: 'Mandala',
    icon: 'mdi:circle-slice-8',
    width: 30,
    height: 30,
    area: 900,
    description: 'Sistema circular',
  },
  {
    name: 'Agrofloresta',
    icon: 'mdi:pine-tree',
    width: 60,
    height: 100,
    area: 6000,
    description: 'Sistema agroflorestal',
  },
  {
    name: 'Quintal Produtivo',
    icon: 'mdi:flower',
    width: 8,
    height: 12,
    area: 96,
    description: 'Aproveitamento de quintal',
  },
  {
    name: 'Lote Urbano',
    icon: 'mdi:city-variant',
    width: 12,
    height: 25,
    area: 300,
    description: 'Terreno urbano padrão',
  },
]

const applyPreset = (preset: (typeof agroPresets)[0]) => {
  localSettings.value.widthMeters = preset.width
  localSettings.value.heightMeters = preset.height

  // Provide visual feedback
  const presetButton = document.querySelector(`[data-preset="${preset.name}"]`)
  if (presetButton) {
    presetButton.classList.add('ring-2', 'ring-green-500', 'ring-opacity-50')
    setTimeout(() => {
      presetButton.classList.remove('ring-2', 'ring-green-500', 'ring-opacity-50')
    }, 1000)
  }
}

watch(
  () => props.settings,
  newSettings => {
    localSettings.value = { ...newSettings }
  },
  { deep: true }
)

const resetToDefaults = () => {
  localSettings.value = {
    widthMeters: 50,
    heightMeters: 50,
    gridSizeMeters: 1,
    showGrid: true,
    snapToGrid: true,
  }
}

const applySettings = () => {
  emit('update', { ...localSettings.value })
  emit('close')
}
</script>

<style scoped>
/* Canvas settings specific styles */
</style>
