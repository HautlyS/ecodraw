/**
 * Privacy-Friendly Analytics
 * Track user behavior without compromising privacy
 */

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
}

class Analytics {
  private enabled: boolean = true
  private queue: AnalyticsEvent[] = []
  private endpoint: string = '/api/analytics'

  constructor() {
    // Check if user has opted out
    this.enabled = localStorage.getItem('analytics_enabled') !== 'false'
  }

  // Track event
  track(name: string, properties?: Record<string, any>) {
    if (!this.enabled) return

    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    }

    this.queue.push(event)

    // Send events in batches
    if (this.queue.length >= 10) {
      this.flush()
    }
  }

  // Track page view
  pageView(path: string) {
    this.track('page_view', { path })
  }

  // Track user action
  action(action: string, category: string, label?: string) {
    this.track('user_action', { action, category, label })
  }

  // Flush queue
  async flush() {
    if (this.queue.length === 0) return

    const events = [...this.queue]
    this.queue = []

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      })
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  // Opt out
  optOut() {
    this.enabled = false
    localStorage.setItem('analytics_enabled', 'false')
    this.queue = []
  }

  // Opt in
  optIn() {
    this.enabled = true
    localStorage.setItem('analytics_enabled', 'true')
  }
}

export const analytics = new Analytics()
