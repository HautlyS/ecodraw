import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCanvasStore } from './canvas'
import type { CanvasElement } from '@/types/canvas'

describe('Canvas Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useCanvasStore()

    expect(store.selectedTool).toBeNull()
    expect(store.selectedElement).toBeNull()
    expect(store.elements).toEqual([])
    expect(store.zoom).toBe(1)
    expect(store.showGrid).toBe(true)
  })

  it('adds elements correctly', () => {
    const store = useCanvasStore()

    const element: CanvasElement = {
      id: '1',
      type: 'plant',
      name: 'Test Plant',
      x: 100,
      y: 100,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    store.addElement(element)

    expect(store.elements).toHaveLength(1)
    expect(store.elements[0]).toEqual(element)
  })

  it('removes elements correctly', () => {
    const store = useCanvasStore()

    const element: CanvasElement = {
      id: '1',
      type: 'plant',
      name: 'Test Plant',
      x: 100,
      y: 100,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    store.addElement(element)
    expect(store.elements).toHaveLength(1)

    store.removeElement('1')
    expect(store.elements).toHaveLength(0)
  })

  it('handles undo/redo correctly', () => {
    const store = useCanvasStore()
    store.initializeHistory()

    const element1: CanvasElement = {
      id: '1',
      type: 'plant',
      name: 'Plant 1',
      x: 100,
      y: 100,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    const element2: CanvasElement = {
      id: '2',
      type: 'plant',
      name: 'Plant 2',
      x: 200,
      y: 200,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    store.addElement(element1)
    expect(store.elements).toHaveLength(1)
    expect(store.canUndo).toBe(true)

    store.addElement(element2)
    expect(store.elements).toHaveLength(2)

    store.undo()
    expect(store.elements).toHaveLength(1)
    expect(store.canRedo).toBe(true)

    store.redo()
    expect(store.elements).toHaveLength(2)
  })

  it('selects and deselects elements', () => {
    const store = useCanvasStore()

    const element: CanvasElement = {
      id: '1',
      type: 'plant',
      name: 'Test Plant',
      x: 100,
      y: 100,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    store.addElement(element)

    store.selectElement('1')
    expect(store.hasSelection).toBe(true)
    expect(store.selectedElements).toHaveLength(1)

    store.deselectAll()
    expect(store.hasSelection).toBe(false)
    expect(store.selectedElements).toHaveLength(0)
  })

  it('copies and pastes elements', () => {
    const store = useCanvasStore()

    const element: CanvasElement = {
      id: '1',
      type: 'plant',
      name: 'Test Plant',
      x: 100,
      y: 100,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    store.addElement(element)
    store.selectElement('1')

    store.copySelected()
    expect(store.clipboard).toHaveLength(1)

    store.pasteClipboard()
    expect(store.elements).toHaveLength(2)
    expect(store.elements[1]?.x).toBe(120) // Offset by 20
  })

  it('updates canvas settings', () => {
    const store = useCanvasStore()

    store.updateCanvasSettings({
      widthMeters: 100,
      heightMeters: 80,
    })

    expect(store.canvasSettings.widthMeters).toBe(100)
    expect(store.canvasSettings.heightMeters).toBe(80)
  })

  it('exports and imports projects', () => {
    const store = useCanvasStore()

    const element: CanvasElement = {
      id: '1',
      type: 'plant',
      name: 'Test Plant',
      x: 100,
      y: 100,
      size: 50,
      shape: 'circle',
      color: '#22c55e',
    }

    store.addElement(element)
    store.setZoom(1.5)

    const exported = store.exportProject()

    expect(exported.elements).toHaveLength(1)
    expect(exported.zoom).toBe(1.5)
    expect(exported.version).toBe('1.0.0')

    // Clear store
    store.clearCanvas()
    expect(store.elements).toHaveLength(0)

    // Import
    const success = store.importProject(exported)
    expect(success).toBe(true)
    expect(store.elements).toHaveLength(1)
    expect(store.zoom).toBe(1.5)
  })
})
