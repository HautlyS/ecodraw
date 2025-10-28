/**
 * Performance Monitoring Composable
 * Tracks and reports performance metrics
 */

import { ref, onMounted } from 'vue'
import { useLogger } from './useLogger'

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memory?: {
    used: number
    total: number
    limit: number
  }
  renderCount: number
  lastRenderTime: number
}

export function usePerformanceMonitor() {
  const logger = useLogger()
  const metrics = ref<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    renderCount: 0,
    lastRenderTime: 0,
  })

  let frameCount = 0
  let lastTime = performance.now()
  let animationFrameId: number | null = null

  /**
   * Update FPS counter
   */
  const updateFPS = () => {
    const now = performance.now()
    const delta = now - lastTime

    if (delta >= 1000) {
      metrics.value.fps = Math.round((frameCount * 1000) / delta)
      metrics.value.frameTime = delta / frameCount
      frameCount = 0
      lastTime = now
    }

    frameCount++
    animationFrameId = requestAnimationFrame(updateFPS)
  }

  /**
   * Get memory usage (if available)
   */
  const updateMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      metrics.value.memory = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      }
    }
  }

  /**
   * Track render performance
   */
  const trackRender = (callback: () => void) => {
    const start = performance.now()
    callback()
    const end = performance.now()

    metrics.value.renderCount++
    metrics.value.lastRenderTime = end - start

    // Log slow renders
    if (metrics.value.lastRenderTime > 50) {
      logger.warn('Slow render detected', {
        renderTime: metrics.value.lastRenderTime,
        renderCount: metrics.value.renderCount,
      })
    }
  }

  /**
   * Get performance report
   */
  const getReport = (): string => {
    const lines = [
      '=== Performance Report ===',
      `FPS: ${metrics.value.fps}`,
      `Frame Time: ${metrics.value.frameTime.toFixed(2)}ms`,
      `Render Count: ${metrics.value.renderCount}`,
      `Last Render: ${metrics.value.lastRenderTime.toFixed(2)}ms`,
    ]

    if (metrics.value.memory) {
      lines.push(
        `Memory Used: ${metrics.value.memory.used}MB / ${metrics.value.memory.total}MB`,
        `Memory Limit: ${metrics.value.memory.limit}MB`
      )
    }

    return lines.join('\n')
  }

  /**
   * Start monitoring
   */
  const start = () => {
    if (animationFrameId === null) {
      lastTime = performance.now()
      frameCount = 0
      updateFPS()
      logger.info('Performance monitoring started')
    }
  }

  /**
   * Stop monitoring
   */
  const stop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
      logger.info('Performance monitoring stopped')
    }
  }

  // Auto-start on mount
  onMounted(() => {
    start()
    // Update memory every 5 seconds
    const memoryInterval = setInterval(updateMemory, 5000)
    return () => {
      stop()
      clearInterval(memoryInterval)
    }
  })

  return {
    metrics,
    trackRender,
    getReport,
    start,
    stop,
  }
}
