/**
 * Project Management Utilities
 * Functions for saving, loading, and managing projects
 */

import type { CanvasElement, CanvasSettings } from '@/types/canvas'
import { validateJSON, sanitizeFilename } from './validation'
import { downloadDataURL, formatFileSize } from './canvas'

export interface Project {
  version: string
  timestamp: string
  name?: string
  description?: string
  settings: CanvasSettings
  elements: CanvasElement[]
  zoom?: number
  pan?: { x: number; y: number }
  metadata?: {
    author?: string
    tags?: string[]
    [key: string]: any
  }
}

/**
 * Export project to JSON string
 */
export function exportProjectToJSON(project: Project): string {
  return JSON.stringify(project, null, 2)
}

/**
 * Import project from JSON string
 */
export function importProjectFromJSON(jsonString: string): {
  success: boolean
  project?: Project
  error?: string
} {
  const validation = validateJSON(jsonString)

  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    }
  }

  const project = validation.data as Project

  // Validate project structure
  if (!project.version || !project.settings || !Array.isArray(project.elements)) {
    return {
      success: false,
      error: 'Invalid project structure',
    }
  }

  return {
    success: true,
    project,
  }
}

/**
 * Download project as JSON file
 */
export function downloadProject(project: Project, filename?: string): void {
  const json = exportProjectToJSON(project)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const name = filename || project.name || 'agroecologia-project'
  const sanitizedName = sanitizeFilename(name)
  const fullFilename = `${sanitizedName}-${Date.now()}.json`

  const link = document.createElement('a')
  link.href = url
  link.download = fullFilename
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Load project from file
 */
export function loadProjectFromFile(file: File): Promise<{
  success: boolean
  project?: Project
  error?: string
}> {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = e => {
      const content = e.target?.result as string
      const result = importProjectFromJSON(content)
      resolve(result)
    }

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read file',
      })
    }

    reader.readAsText(file)
  })
}

/**
 * Save project to localStorage
 */
export function saveProjectToLocalStorage(key: string, project: Project): boolean {
  try {
    const json = exportProjectToJSON(project)
    localStorage.setItem(key, json)
    return true
  } catch (error) {
    console.error('Failed to save project to localStorage:', error)
    return false
  }
}

/**
 * Load project from localStorage
 */
export function loadProjectFromLocalStorage(key: string): {
  success: boolean
  project?: Project
  error?: string
} {
  try {
    const json = localStorage.getItem(key)
    if (!json) {
      return {
        success: false,
        error: 'Project not found',
      }
    }
    return importProjectFromJSON(json)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get recent projects from localStorage
 */
export function getRecentProjects(maxCount: number = 10): Project[] {
  const projects: Project[] = []

  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('auto_save_'))

    for (const key of keys.slice(0, maxCount)) {
      const result = loadProjectFromLocalStorage(key)
      if (result.success && result.project) {
        projects.push(result.project)
      }
    }

    // Sort by timestamp (newest first)
    projects.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error('Failed to get recent projects:', error)
  }

  return projects
}

/**
 * Delete project from localStorage
 */
export function deleteProjectFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Failed to delete project:', error)
    return false
  }
}

/**
 * Get project size in bytes
 */
export function getProjectSize(project: Project): number {
  const json = exportProjectToJSON(project)
  return new Blob([json]).size
}

/**
 * Get formatted project size
 */
export function getFormattedProjectSize(project: Project): string {
  return formatFileSize(getProjectSize(project))
}

/**
 * Create project template
 */
export function createProjectTemplate(
  name: string,
  description: string,
  settings: CanvasSettings,
  elements: CanvasElement[] = []
): Project {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    name,
    description,
    settings,
    elements,
    metadata: {
      template: true,
    },
  }
}

/**
 * Validate project compatibility
 */
export function validateProjectCompatibility(project: Project): {
  compatible: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Check version
  const currentVersion = '1.0.0'
  if (project.version !== currentVersion) {
    warnings.push(
      `Project version (${project.version}) differs from current version (${currentVersion})`
    )
  }

  // Check for missing required fields
  if (!project.settings) {
    warnings.push('Missing canvas settings')
  }

  if (!Array.isArray(project.elements)) {
    warnings.push('Invalid elements array')
  }

  return {
    compatible: warnings.length === 0,
    warnings,
  }
}

/**
 * Merge projects
 */
export function mergeProjects(base: Project, overlay: Project): Project {
  return {
    ...base,
    timestamp: new Date().toISOString(),
    elements: [...base.elements, ...overlay.elements],
    metadata: {
      ...base.metadata,
      ...overlay.metadata,
      merged: true,
      mergedFrom: [base.name, overlay.name].filter(Boolean),
    },
  }
}

/**
 * Clone project
 */
export function cloneProject(project: Project, newName?: string): Project {
  return {
    ...JSON.parse(JSON.stringify(project)),
    timestamp: new Date().toISOString(),
    name: newName || `${project.name} (Copy)`,
    metadata: {
      ...project.metadata,
      clonedFrom: project.name,
    },
  }
}
