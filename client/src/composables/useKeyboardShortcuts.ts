/**
 * Keyboard Shortcuts Composable
 * Centralized keyboard shortcut management
 */

import { onMounted, onUnmounted } from 'vue'
import { KEYBOARD_SHORTCUTS } from '@/constants/canvas'

export type ShortcutHandler = (event: KeyboardEvent) => void

export interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: ShortcutHandler
  description?: string
  preventDefault?: boolean
}

export function useKeyboardShortcuts() {
  const shortcuts = new Map<string, ShortcutConfig>()

  /**
   * Register a keyboard shortcut
   */
  function register(config: ShortcutConfig) {
    const key = createShortcutKey(config)
    shortcuts.set(key, config)
  }

  /**
   * Unregister a keyboard shortcut
   */
  function unregister(config: Omit<ShortcutConfig, 'handler' | 'description'>) {
    const key = createShortcutKey(config)
    shortcuts.delete(key)
  }

  /**
   * Create unique key for shortcut
   */
  function createShortcutKey(config: Partial<ShortcutConfig>): string {
    const parts: string[] = []
    if (config.ctrl) parts.push('ctrl')
    if (config.shift) parts.push('shift')
    if (config.alt) parts.push('alt')
    parts.push(config.key?.toLowerCase() || '')
    return parts.join('+')
  }

  /**
   * Handle keyboard event
   */
  function handleKeydown(event: KeyboardEvent) {
    // Ignore shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return
    }

    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey
    const alt = event.altKey

    const shortcutKey = createShortcutKey({ key, ctrl, shift, alt })
    const config = shortcuts.get(shortcutKey)

    if (config) {
      if (config.preventDefault !== false) {
        event.preventDefault()
        event.stopPropagation()
      }
      config.handler(event)
    }
  }

  /**
   * Register common shortcuts
   */
  function registerCommonShortcuts(handlers: {
    onUndo?: () => void
    onRedo?: () => void
    onSave?: () => void
    onExport?: () => void
    onZoomIn?: () => void
    onZoomOut?: () => void
    onResetZoom?: () => void
    onToggleGrid?: () => void
    onOpenLibrary?: () => void
    onHelp?: () => void
    onSelectAll?: () => void
    onDeselect?: () => void
    onDelete?: () => void
    onDuplicate?: () => void
    onCopy?: () => void
    onPaste?: () => void
  }) {
    if (handlers.onUndo) {
      register({
        key: 'z',
        ctrl: true,
        handler: handlers.onUndo,
        description: 'Undo',
      })
    }

    if (handlers.onRedo) {
      register({
        key: 'y',
        ctrl: true,
        handler: handlers.onRedo,
        description: 'Redo',
      })
      register({
        key: 'z',
        ctrl: true,
        shift: true,
        handler: handlers.onRedo,
        description: 'Redo (alternative)',
      })
    }

    if (handlers.onSave) {
      register({
        key: 's',
        ctrl: true,
        handler: handlers.onSave,
        description: 'Save',
      })
    }

    if (handlers.onExport) {
      register({
        key: 'e',
        ctrl: true,
        handler: handlers.onExport,
        description: 'Export',
      })
    }

    if (handlers.onZoomIn) {
      register({
        key: '+',
        handler: handlers.onZoomIn,
        description: 'Zoom in',
      })
      register({
        key: '=',
        handler: handlers.onZoomIn,
        description: 'Zoom in (alternative)',
      })
    }

    if (handlers.onZoomOut) {
      register({
        key: '-',
        handler: handlers.onZoomOut,
        description: 'Zoom out',
      })
    }

    if (handlers.onResetZoom) {
      register({
        key: '0',
        handler: handlers.onResetZoom,
        description: 'Reset zoom',
      })
    }

    if (handlers.onToggleGrid) {
      register({
        key: 'g',
        handler: handlers.onToggleGrid,
        description: 'Toggle grid',
      })
    }

    if (handlers.onOpenLibrary) {
      register({
        key: 'l',
        handler: handlers.onOpenLibrary,
        description: 'Open library',
      })
    }

    if (handlers.onHelp) {
      register({
        key: '?',
        handler: handlers.onHelp,
        description: 'Show help',
      })
    }

    if (handlers.onSelectAll) {
      register({
        key: 'a',
        ctrl: true,
        handler: handlers.onSelectAll,
        description: 'Select all',
      })
    }

    if (handlers.onDeselect) {
      register({
        key: 'escape',
        handler: handlers.onDeselect,
        description: 'Deselect',
        preventDefault: false,
      })
    }

    if (handlers.onDelete) {
      register({
        key: 'delete',
        handler: handlers.onDelete,
        description: 'Delete',
      })
      register({
        key: 'backspace',
        handler: handlers.onDelete,
        description: 'Delete (alternative)',
      })
    }

    if (handlers.onDuplicate) {
      register({
        key: 'd',
        ctrl: true,
        handler: handlers.onDuplicate,
        description: 'Duplicate',
      })
    }

    if (handlers.onCopy) {
      register({
        key: 'c',
        ctrl: true,
        handler: handlers.onCopy,
        description: 'Copy',
      })
    }

    if (handlers.onPaste) {
      register({
        key: 'v',
        ctrl: true,
        handler: handlers.onPaste,
        description: 'Paste',
      })
    }
  }

  /**
   * Get all registered shortcuts
   */
  function getShortcuts(): ShortcutConfig[] {
    return Array.from(shortcuts.values())
  }

  // Setup and cleanup
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    shortcuts.clear()
  })

  return {
    register,
    unregister,
    registerCommonShortcuts,
    getShortcuts,
  }
}
