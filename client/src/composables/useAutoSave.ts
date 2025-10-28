/**
 * Auto-save Composable
 * Automatically saves project state to localStorage
 */

import { ref, watch, onUnmounted } from 'vue'
import { debounce } from '@/utils/canvas'
import { LOCAL_STORAGE_KEYS, CANVAS_CONSTRAINTS } from '@/constants/canvas'
import { useLogger } from './useLogger'
import type { Project } from '@/utils/project'

export interface AutoSaveOptions {
  key?: string
  debounceMs?: number
  enabled?: boolean
  onSave?: (project: Project) => void
  onError?: (error: Error) => void
}

export function useAutoSave(getProject: () => Project, options: AutoSaveOptions = {}) {
  const logger = useLogger()
  const {
    key = LOCAL_STORAGE_KEYS.AUTO_SAVE + 'default',
    debounceMs = CANVAS_CONSTRAINTS.AUTO_SAVE_DEBOUNCE_MS,
    enabled = true,
    onSave,
    onError,
  } = options

  const isEnabled = ref(enabled)
  const lastSaveTime = ref<Date | null>(null)
  const isSaving = ref(false)

  /**
   * Save project to localStorage
   */
  const save = async () => {
    if (!isEnabled.value || isSaving.value) return

    try {
      isSaving.value = true
      const project = getProject()
      const json = JSON.stringify(project)

      localStorage.setItem(key, json)
      lastSaveTime.value = new Date()

      logger.info('Auto-save successful', {
        key,
        size: json.length,
        timestamp: lastSaveTime.value.toISOString(),
      })

      onSave?.(project)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Auto-save failed')
      logger.error('Auto-save failed', { key }, err)
      onError?.(err)
    } finally {
      isSaving.value = false
    }
  }

  /**
   * Debounced save function
   */
  const debouncedSave = debounce(save, debounceMs)

  /**
   * Load project from localStorage
   */
  const load = (): Project | null => {
    try {
      const json = localStorage.getItem(key)
      if (!json) return null

      const project = JSON.parse(json) as Project
      logger.info('Auto-save loaded', { key })
      return project
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Load failed')
      logger.error('Failed to load auto-save', { key }, err)
      return null
    }
  }

  /**
   * Clear auto-save
   */
  const clear = () => {
    try {
      localStorage.removeItem(key)
      lastSaveTime.value = null
      logger.info('Auto-save cleared', { key })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Clear failed')
      logger.error('Failed to clear auto-save', { key }, err)
    }
  }

  /**
   * Enable auto-save
   */
  const enable = () => {
    isEnabled.value = true
    logger.info('Auto-save enabled', { key })
  }

  /**
   * Disable auto-save
   */
  const disable = () => {
    isEnabled.value = false
    logger.info('Auto-save disabled', { key })
  }

  /**
   * Trigger immediate save
   */
  const saveNow = () => {
    save()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    // Save one last time before unmounting
    if (isEnabled.value) {
      save()
    }
  })

  return {
    isEnabled,
    lastSaveTime,
    isSaving,
    save: debouncedSave,
    saveNow,
    load,
    clear,
    enable,
    disable,
  }
}
