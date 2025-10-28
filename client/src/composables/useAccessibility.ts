/**
 * Accessibility Composable
 * WCAG 2.1 AA compliance utilities
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useEventListener, usePreferredReducedMotion } from '@vueuse/core'

export interface AccessibilityOptions {
  announceChanges?: boolean
  trapFocus?: boolean
  enableKeyboardNav?: boolean
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const { announceChanges = true, trapFocus = false, enableKeyboardNav = true } = options

  const prefersReducedMotion = usePreferredReducedMotion()
  const announcer = ref<HTMLElement | null>(null)
  const focusTrap = ref<HTMLElement | null>(null)
  const focusableElements = ref<HTMLElement[]>([])
  const currentFocusIndex = ref(0)

  // Create screen reader announcer
  const createAnnouncer = () => {
    if (!announceChanges) return

    const element = document.createElement('div')
    element.setAttribute('role', 'status')
    element.setAttribute('aria-live', 'polite')
    element.setAttribute('aria-atomic', 'true')
    element.className = 'sr-only'
    element.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `
    document.body.appendChild(element)
    announcer.value = element
  }

  // Announce message to screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcer.value) return

    announcer.value.setAttribute('aria-live', priority)
    announcer.value.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (announcer.value) {
        announcer.value.textContent = ''
      }
    }, 1000)
  }

  // Get all focusable elements
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
  }

  // Setup focus trap
  const setupFocusTrap = (container: HTMLElement) => {
    if (!trapFocus) return

    focusTrap.value = container
    focusableElements.value = getFocusableElements(container)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !focusableElements.value.length) return

      const firstElement = focusableElements.value[0]
      const lastElement = focusableElements.value[focusableElements.value.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  // Navigate to next focusable element
  const focusNext = () => {
    if (!focusableElements.value.length) return

    currentFocusIndex.value = (currentFocusIndex.value + 1) % focusableElements.value.length
    focusableElements.value[currentFocusIndex.value]?.focus()
  }

  // Navigate to previous focusable element
  const focusPrevious = () => {
    if (!focusableElements.value.length) return

    currentFocusIndex.value =
      (currentFocusIndex.value - 1 + focusableElements.value.length) %
      focusableElements.value.length
    focusableElements.value[currentFocusIndex.value]?.focus()
  }

  // Check color contrast ratio
  const getContrastRatio = (foreground: string, background: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
      const [r, g, b] = rgb.map(val => {
        const sRGB = val / 255
        return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  // Check if contrast meets WCAG AA standards
  const meetsContrastRequirement = (
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    isLargeText = false
  ): boolean => {
    const ratio = getContrastRatio(foreground, background)
    const requirement = level === 'AAA' ? (isLargeText ? 4.5 : 7) : isLargeText ? 3 : 4.5
    return ratio >= requirement
  }

  // Add skip link
  const addSkipLink = (targetId: string, label = 'Skip to main content') => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.textContent = label
    skipLink.className = 'skip-link'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    `

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0'
    })

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })

    document.body.insertBefore(skipLink, document.body.firstChild)

    return () => {
      skipLink.remove()
    }
  }

  // Keyboard navigation handler
  const handleKeyboardNav = (e: KeyboardEvent, handlers: Record<string, () => void>) => {
    if (!enableKeyboardNav) return

    const key = e.key.toLowerCase()
    const handler = handlers[key] || handlers[`${e.ctrlKey ? 'ctrl+' : ''}${key}`]

    if (handler) {
      e.preventDefault()
      handler()
    }
  }

  // Setup
  onMounted(() => {
    createAnnouncer()
  })

  // Cleanup
  onUnmounted(() => {
    if (announcer.value) {
      announcer.value.remove()
    }
  })

  return {
    announce,
    setupFocusTrap,
    focusNext,
    focusPrevious,
    getContrastRatio,
    meetsContrastRequirement,
    addSkipLink,
    handleKeyboardNav,
    prefersReducedMotion,
    focusableElements,
  }
}
