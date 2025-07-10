import React, { useState, useCallback, useMemo, memo, useRef } from "react";
import { Plant, Terrain } from "@/types/canvasTypes";
import { UnifiedToolbar } from "@/components/UnifiedToolbar";
import { PlantLibrary } from "@/components/PlantLibrary";
import { Canvas, CanvasRef } from "@/components/Canvas";
import { WelcomeModal } from "@/components/WelcomeModal";
import { TerrainLibrary } from "@/components/TerrainLibrary";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Leaf, Mountain } from "lucide-react";

const MemoizedPlantLibrary = memo(PlantLibrary);
const MemoizedTerrainLibrary = memo(TerrainLibrary);

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeLibrary, setActiveLibrary] = useState<"plants" | "terrain">("plants");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 50, height: 30 });

  const { isMobile, isTablet } = useResponsive();
  const isCompact = isMobile || isTablet;

  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
    if (tool === "terrain") {
      setActiveLibrary("terrain");
    } else if (tool === "select" || tool === "rectangle" || tool === "circle") {
      setActiveLibrary("plants");
    }
  }, []);

  const handleLibraryChange = useCallback((library: "plants" | "terrain") => {
    setActiveLibrary(library);
    if (library === "terrain" && selectedTool !== "terrain") {
      setSelectedTool("terrain");
    } else if (library === "plants" && selectedTool === "terrain") {
      setSelectedTool("select");
    }
  }, [selectedTool]);

  const handlePlantUsed = useCallback(() => {}, []);
  const handleTerrainUsed = useCallback(() => {}, []);
  const handleWelcomeClose = useCallback(() => setShowWelcome(false), []);
  
  const handleCanvasSizeChange = useCallback((size: { width: number; height: number }) => {
    setCanvasSize(size);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Memoized sidebar content to prevent unnecessary re-renders
  const sidebarContent = useMemo(() => (
    <div className="h-full flex flex-col">
      <Tabs 
        value={activeLibrary} 
        onValueChange={(value) => handleLibraryChange(value as "plants" | "terrain")} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 mb-2 h-9">
          <TabsTrigger value="plants" className="flex items-center gap-2 text-xs">
            <Leaf className="h-3.5 w-3.5" />
            Plantas
          </TabsTrigger>
          <TabsTrigger value="terrain" className="flex items-center gap-2 text-xs">
            <Mountain className="h-3.5 w-3.5" />
            Terreno
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plants" className="flex-1 mt-0">
          <MemoizedPlantLibrary 
            selectedPlant={selectedPlant}
            onPlantSelect={setSelectedPlant}
          />
        </TabsContent>
        
        <TabsContent value="terrain" className="flex-1 mt-0">
          <MemoizedTerrainLibrary 
            selectedTerrain={selectedTerrain}
            onTerrainSelect={setSelectedTerrain}
          />
        </TabsContent>
      </Tabs>
    </div>
  ), [activeLibrary, selectedPlant, selectedTerrain, handleLibraryChange]);

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden layout-container">
        {/* Unified Toolbar - Borderless Integration */}
        <UnifiedToolbar 
          selectedTool={selectedTool}
          onToolSelect={handleToolSelect}
          onUndo={() => console.log('undo')}
          onRedo={() => console.log('redo')}
          canUndo={false}
          canRedo={false}
          canvasSize={canvasSize}
          onCanvasSizeChange={handleCanvasSizeChange}
        />

        {/* Main Content: Canvas + Sidebar - Seamless Integration */}
        <div className="flex-1 flex min-h-0">
          {/* Canvas - Performance Optimized */}
          <div className="flex-1 relative canvas-area">
            <MemoizedCanvas 
              selectedTool={selectedTool}
              selectedPlant={selectedPlant}
              selectedTerrain={selectedTerrain}
              onPlantUsed={handlePlantUsed}
              onTerrainUsed={handleTerrainUsed}
              onToolChange={handleToolSelect}
              canvasSize={canvasSize}
              onCanvasSizeChange={handleCanvasSizeChange}
            />
          </div>

          {/* Modern Sidebar - Borderless Design */}
          {!isCompact && (
            <div className={cn(
              "sidebar transition-all duration-300 ease-in-out relative",
              "border-l border-gray-200 dark:border-gray-800",
              sidebarCollapsed ? "w-0" : "w-80"
            )}>
              {/* Sidebar Toggle - Floating Design */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className={cn(
                  "absolute top-4 z-20 h-8 w-8 rounded-full transition-all duration-300",
                  "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md",
                  "hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg",
                  sidebarCollapsed ? "-left-4" : "left-4"
                )}
              >
                {sidebarCollapsed ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {/* Sidebar Content - Only render when not collapsed for performance */}
              {!sidebarCollapsed && sidebarContent}
            </div>
          )}
        </div>

        {/* Mobile Navigation - Clean Integration */}
        {isCompact && (
          <MobileNavigation
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
            activeLibrary={activeLibrary}
            onLibraryChange={handleLibraryChange}
          />
        )}

        {/* Welcome Modal */}
        <WelcomeModal 
          open={showWelcome}
          onClose={handleWelcomeClose}
        />
      </div>
    </ThemeProvider>
  );
};

export default memo(Index);