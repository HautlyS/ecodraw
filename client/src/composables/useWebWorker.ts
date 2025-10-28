/**
 * Web Worker Composable
 * Offload heavy computations to background threads
 */

import { ref, onUnmounted } from 'vue'

export interface WorkerMessage<T = any> {
  type: string
  payload: T
}

export interface WorkerResponse<T = any> {
  type: string
  result: T
  error?: string
}

export function useWebWorker<T = any, R = any>(workerUrl: string) {
  const worker = ref<Worker | null>(null)
  const isReady = ref(false)
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  // Initialize worker
  const init = () => {
    try {
      worker.value = new Worker(workerUrl, { type: 'module' })

      worker.value.onmessage = (e: MessageEvent<WorkerResponse<R>>) => {
        isProcessing.value = false

        if (e.data.error) {
          error.value = e.data.error
        }
      }

      worker.value.onerror = (e: ErrorEvent) => {
        isProcessing.value = false
        error.value = e.message
        console.error('Worker error:', e)
      }

      isReady.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to initialize worker'
      console.error('Failed to create worker:', e)
    }
  }

  // Post message to worker
  const postMessage = (message: WorkerMessage<T>): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!worker.value || !isReady.value) {
        reject(new Error('Worker not ready'))
        return
      }

      isProcessing.value = true
      error.value = null

      const handleMessage = (e: MessageEvent<WorkerResponse<R>>) => {
        if (e.data.type === message.type) {
          worker.value?.removeEventListener('message', handleMessage)

          if (e.data.error) {
            reject(new Error(e.data.error))
          } else {
            resolve(e.data.result)
          }
        }
      }

      worker.value.addEventListener('message', handleMessage)
      worker.value.postMessage(message)
    })
  }

  // Terminate worker
  const terminate = () => {
    if (worker.value) {
      worker.value.terminate()
      worker.value = null
      isReady.value = false
    }
  }

  // Initialize on creation
  init()

  // Cleanup on unmount
  onUnmounted(() => {
    terminate()
  })

  return {
    worker,
    isReady,
    isProcessing,
    error,
    postMessage,
    terminate,
  }
}
