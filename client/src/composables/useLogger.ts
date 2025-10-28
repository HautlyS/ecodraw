/**
 * Centralized Logging System
 * Provides structured logging with levels and context
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = import.meta.env.DEV

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error,
    }

    this.logs.push(entry)

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output in development
    if (this.isDevelopment) {
      const prefix = `[${level.toUpperCase()}]`
      const timestamp = entry.timestamp.toISOString()
      const contextStr = context ? JSON.stringify(context) : ''

      switch (level) {
        case 'debug':
          console.debug(prefix, timestamp, message, contextStr)
          break
        case 'info':
          console.info(prefix, timestamp, message, contextStr)
          break
        case 'warn':
          console.warn(prefix, timestamp, message, contextStr, error)
          break
        case 'error':
          console.error(prefix, timestamp, message, contextStr, error)
          break
      }
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>, error?: Error) {
    this.log('warn', message, context, error)
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log('error', message, context, error)
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Singleton instance
const logger = new Logger()

export function useLogger() {
  return logger
}
