<template>
  <ErrorBoundary>
    <div id="app" class="min-h-screen bg-white dark:bg-black">
      <RouterView />
      <Toaster />
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import { useTheme } from '@/composables/useTheme'
import { onMounted } from 'vue'

// Initialize theme on app mount
const { loadTheme } = useTheme()

onMounted(() => {
  loadTheme()
})
</script>
