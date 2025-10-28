<template>
  <div
    v-if="hasError"
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800"
    >
      <div
        class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full"
      >
        <Icon icon="mdi:alert-circle" class="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>

      <h1 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
        Oops! Something went wrong
      </h1>

      <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
        We encountered an unexpected error. Don't worry, your work might be saved.
      </p>

      <div v-if="error" class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p class="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
          {{ error.message }}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <button
          @click="handleReload"
          class="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <Icon icon="mdi:refresh" class="w-5 h-5 inline mr-2" />
          Reload Application
        </button>

        <button
          @click="handleReset"
          class="w-full px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Icon icon="mdi:restore" class="w-5 h-5 inline mr-2" />
          Reset to Default
        </button>

        <button
          v-if="showDetails"
          @click="copyError"
          class="w-full px-6 py-3 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <Icon icon="mdi:content-copy" class="w-5 h-5 inline mr-2" />
          Copy Error Details
        </button>
      </div>

      <button
        @click="showDetails = !showDetails"
        class="mt-4 w-full text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        {{ showDetails ? 'Hide' : 'Show' }} technical details
      </button>

      <div
        v-if="showDetails && errorInfo"
        class="mt-4 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800"
      >
        <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-48">{{
          errorInfo
        }}</pre>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { Icon } from '@iconify/vue'

const hasError = ref(false)
const error = ref<Error | null>(null)
const errorInfo = ref<string>('')
const showDetails = ref(false)

onErrorCaptured((err: Error, instance, info) => {
  hasError.value = true
  error.value = err
  errorInfo.value = `
Component: ${instance?.$options.name || 'Unknown'}
Error: ${err.message}
Stack: ${err.stack || 'No stack trace'}
Info: ${info}
  `.trim()

  // Log to console for debugging
  console.error('Error captured:', err)
  console.error('Component info:', info)
  console.error('Stack:', err.stack)

  // Prevent error from propagating
  return false
})

const handleReload = () => {
  window.location.reload()
}

const handleReset = () => {
  // Clear localStorage
  localStorage.clear()
  window.location.reload()
}

const copyError = async () => {
  try {
    await navigator.clipboard.writeText(errorInfo.value)
    alert('Error details copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
