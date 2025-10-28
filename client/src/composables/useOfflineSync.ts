/**
 * Offline Sync Composable
 * Handles offline data persistence and synchronization
 */

import { ref, watch } from 'vue'
import { useOnline } from '@vueuse/core'

export interface SyncQueueItem {
  id: string
  type: 'create' | 'update' | 'delete'
  resource: string
  data: any
  timestamp: number
  retries: number
}

export function useOfflineSync() {
  const isOnline = useOnline()
  const syncQueue = ref<SyncQueueItem[]>([])
  const isSyncing = ref(false)
  const lastSyncTime = ref<number | null>(null)

  // Load queue from IndexedDB
  const loadQueue = async () => {
    try {
      const db = await openDB()
      const tx = db.transaction('syncQueue', 'readonly')
      const store = tx.objectStore('syncQueue')
      const items = await store.getAll()
      syncQueue.value = items
    } catch (error) {
      console.error('Failed to load sync queue:', error)
    }
  }

  // Save queue to IndexedDB
  const saveQueue = async () => {
    try {
      const db = await openDB()
      const tx = db.transaction('syncQueue', 'readwrite')
      const store = tx.objectStore('syncQueue')

      await store.clear()
      for (const item of syncQueue.value) {
        await store.add(item)
      }
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }

  // Add item to sync queue
  const addToQueue = async (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>) => {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    }

    syncQueue.value.push(queueItem)
    await saveQueue()

    // Try to sync immediately if online
    if (isOnline.value) {
      await syncAll()
    }
  }

  // Sync a single item
  const syncItem = async (item: SyncQueueItem): Promise<boolean> => {
    try {
      const endpoint = `/api/${item.resource}`
      const method = item.type === 'create' ? 'POST' : item.type === 'update' ? 'PUT' : 'DELETE'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item.data),
      })

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error('Failed to sync item:', error)
      return false
    }
  }

  // Sync all queued items
  const syncAll = async () => {
    if (isSyncing.value || !isOnline.value || syncQueue.value.length === 0) {
      return
    }

    isSyncing.value = true

    try {
      const itemsToSync = [...syncQueue.value]
      const failedItems: SyncQueueItem[] = []

      for (const item of itemsToSync) {
        const success = await syncItem(item)

        if (success) {
          // Remove from queue
          syncQueue.value = syncQueue.value.filter(i => i.id !== item.id)
        } else {
          // Increment retry count
          item.retries++

          // Remove if too many retries
          if (item.retries >= 3) {
            console.warn('Item failed after 3 retries, removing from queue:', item)
            syncQueue.value = syncQueue.value.filter(i => i.id !== item.id)
          } else {
            failedItems.push(item)
          }
        }
      }

      await saveQueue()
      lastSyncTime.value = Date.now()
    } finally {
      isSyncing.value = false
    }
  }

  // Open IndexedDB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AgroPlanner', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' })
        }
      }
    })
  }

  // Watch online status and sync when coming back online
  watch(isOnline, online => {
    if (online && syncQueue.value.length > 0) {
      syncAll()
    }
  })

  // Initialize
  loadQueue()

  return {
    isOnline,
    syncQueue,
    isSyncing,
    lastSyncTime,
    addToQueue,
    syncAll,
  }
}
