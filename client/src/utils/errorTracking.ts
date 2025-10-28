/**
 * Error Tracking Utility
 * Capture and report errors for debugging
 */

interface ErrorReport {
  message: string
  stack?: string
  context?: Record<string, any>
  timestamp: number
  userAgent: string
  url: string
}

class ErrorTracker {
  private endpoint: string = '/api/errors'
  private enabled: boolean = true

  constructor() {
    this.setupGlobalHandlers()
  }

  // Setup global error handlers
  private setupGlobalHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', event => {
      this.captureError(event.error, {
        type: 'unhandled_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.captureError(event.reason, {
        type: 'unhandled_rejection',
      })
    })
  }

  // Capture error
  captureError(error: Error | string, context?: Record<string, any>) {
    if (!this.enabled) return

    const report: ErrorReport = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    this.sendReport(report)
  }

  // Send error report
  private async sendReport(report: ErrorReport) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      })
    } catch (error) {
      console.error('Failed to send error report:', error)
    }
  }

  // Disable error tracking
  disable() {
    this.enabled = false
  }

  // Enable error tracking
  enable() {
    this.enabled = true
  }
}

export const errorTracker = new ErrorTracker()
