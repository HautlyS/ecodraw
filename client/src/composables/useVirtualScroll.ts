/**
 * Virtual Scroll Composable
 * Efficiently render large lists by only rendering visible items
 */

import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { useThrottleFn } from '@vueuse/core'

export interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  buffer?: number
  items: Ref<any[]>
}

export function useVirtualScroll(options: VirtualScrollOptions) {
  const { itemHeight, containerHeight, buffer = 5, items } = options

  const scrollTop = ref(0)
  const containerRef = ref<HTMLElement | null>(null)

  // Calculate visible range
  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.ceil((scrollTop.value + containerHeight) / itemHeight)

    return {
      start: Math.max(0, start - buffer),
      end: Math.min(items.value.length, end + buffer),
    }
  })

  // Get visible items
  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.value.slice(start, end).map((item, index) => ({
      item,
      index: start + index,
      top: (start + index) * itemHeight,
    }))
  })

  // Total height of all items
  const totalHeight = computed(() => items.value.length * itemHeight)

  // Offset for the visible items container
  const offsetY = computed(() => visibleRange.value.start * itemHeight)

  // Handle scroll
  const handleScroll = useThrottleFn((e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }, 16)

  // Scroll to index
  const scrollToIndex = (index: number, behavior: ScrollBehavior = 'smooth') => {
    if (!containerRef.value) return

    const top = index * itemHeight
    containerRef.value.scrollTo({ top, behavior })
  }

  // Setup scroll listener
  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('scroll', handleScroll)
    }
  })

  // Cleanup
  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    scrollToIndex,
    visibleRange,
  }
}
