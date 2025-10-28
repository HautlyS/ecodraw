import React, { useEffect, useRef, useState } from 'react'
import { CanvasRenderer } from './CanvasRenderer'
import { CanvasEventHandler } from './CanvasEventHandler'
import { CanvasControls } from './CanvasControls'
import { Dimensions } from '../../utils/canvasCoordinates'
import { Plant, Terrain } from '../../types/canvasTypes'
import { CANVAS_CONSTANTS } from '../../utils/canvasConstants'

interface CanvasContainerProps {
  selectedTool: string
  selectedPlant: Plant | null
  selectedTerrain: Terrain | null
  onPlantUsed: () => void
  onTerrainUsed: () => void
  onToolChange: (tool: string) => void
  canvasSize?: Dimensions
  onCanvasSizeChange?: (size: Dimensions) => void
}

export const CanvasContainer = ({
  selectedTool,
  selectedPlant,
  selectedTerrain,
  onPlantUsed,
  onTerrainUsed,
  onToolChange,
  canvasSize,
  onCanvasSizeChange,
}: CanvasContainerProps) => {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [elements, setElements] = useState([])
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)

  // Effects for updating canvas dimensions when size changes
  useEffect(() => {
    if (canvasSize) {
      setCanvasDimensions(canvasSize)
    }
  }, [canvasSize])

  return (
    <div ref={canvasRef} className="canvas-container">
      <CanvasControls showGrid={showGrid} setShowGrid={setShowGrid} zoom={zoom} setZoom={setZoom} />
      <CanvasEventHandler
        canvasRef={canvasRef}
        selectedTool={selectedTool}
        setPanOffset={setPanOffset}
        panOffset={panOffset}
        zoom={zoom}
        elements={elements}
        setElements={setElements}
      />
      <CanvasRenderer
        elements={elements}
        showGrid={showGrid}
        zoom={zoom}
        panOffset={panOffset}
        selectedTool={selectedTool}
      />
    </div>
  )
}
