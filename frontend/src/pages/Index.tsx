
import { useState, useCallback, useMemo } from "react";
import { Plant, Terrain } from "@/types/canvasTypes";
import { UnifiedToolbar } from "@/components/UnifiedToolbar";
import { PlantLibrary } from "@/components/PlantLibrary";
import { Canvas } from "@/components/Canvas";
import { WelcomeModal } from "@/components/WelcomeModal";
import { TerrainLibrary } from "@/components/TerrainLibrary";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Leaf, Mountain } from "lucide-react";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeLibrary, setActiveLibrary] = useState<"plants" | "terrain">("plants");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 50, height: 30 });

  const { isMobile, isTablet, isDesktop, isLargeDesktop, isUltraWide, screenHeight, screenWidth, aspectRatio } = useResponsive();
  const isCompact = isMobile || isTablet;
  const isWideScreen = isLargeDesktop || isUltraWide;
  const hasWideAspectRatio = aspectRatio > 1.5;

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
    // Auto-switch to appropriate tool when changing libraries
    if (library === "terrain" && selectedTool !== "terrain") {
      setSelectedTool("terrain");
    } else if (library === "plants" && selectedTool === "terrain") {
      setSelectedTool("select");
    }
  }, [selectedTool]);

  const handlePlantUsed = useCallback(() => {}, []); // Don't clear selection after use
  const handleTerrainUsed = useCallback(() => {}, []); // Don't clear selection after use
  const handleWelcomeClose = useCallback(() => setShowWelcome(false), []);
  const handleCanvasSizeChange = useCallback((size: { width: number; height: number }) => {
    setCanvasSize(size);
  }, []);

  // Enhanced height calculations based on screen size and device type (memoized)
  const layoutConfig = useMemo(() => {
    const headerHeight = isCompact ? "3.5rem" : isWideScreen ? "4.5rem" : "4rem";
    const toolbarHeight = isCompact ? "0" : isWideScreen ? "4.5rem" : "4rem";
    const mobileNavHeight = isCompact ? "4rem" : "0";
    const safeAreaTop = isCompact ? "env(safe-area-inset-top)" : "0px";
    const safeAreaBottom = isCompact ? "env(safe-area-inset-bottom)" : "0px";
    
    return {
      headerHeight,
      toolbarHeight,
      mobileNavHeight,
      safeAreaTop,
      safeAreaBottom,
      availableHeight: `calc(100vh - ${headerHeight} - ${toolbarHeight} - ${mobileNavHeight} - ${safeAreaTop} - ${safeAreaBottom})`,
      dynamicHeight: `calc(var(--vh, 1vh) * 100 - ${headerHeight} - ${toolbarHeight} - ${mobileNavHeight} - ${safeAreaTop} - ${safeAreaBottom})`,
      sidebarWidth: isUltraWide ? "24rem" : isLargeDesktop ? "22rem" : "20rem",
      sidebarCollapsedWidth: isWideScreen ? "3rem" : "0"
    };
  }, [isCompact, isWideScreen, isLargeDesktop, isUltraWide]);

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Unified Toolbar */}
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

        {/* Main Content: Canvas + Sidebar */}
        <div className="flex-1 flex min-h-0">
          {/* Canvas - Full Screen */}
          <div className="flex-1 relative">
            <Canvas 
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

          {/* Modern Sidebar */}
          {!isCompact && (
            <div className={cn(
              "bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transition-all duration-300 relative",
              sidebarCollapsed ? "w-0" : "w-80"
            )}>
              {/* Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={cn(
                  "absolute top-4 z-10 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md",
                  sidebarCollapsed ? "-left-4" : "left-4"
                )}
              >
                {sidebarCollapsed ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {/* Sidebar Content */}
              {!sidebarCollapsed && (
                <div className="h-full flex flex-col p-4">
                  {/* Library Tabs */}
                  <Tabs value={activeLibrary} onValueChange={(value) => handleLibraryChange(value as "plants" | "terrain")} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="plants" className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        Plants
                      </TabsTrigger>
                      <TabsTrigger value="terrain" className="flex items-center gap-2">
                        <Mountain className="h-4 w-4" />
                        Terrain
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="plants" className="flex-1 mt-0">
                      <PlantLibrary 
                        selectedPlant={selectedPlant}
                        onPlantSelect={setSelectedPlant}
                      />
                    </TabsContent>
                    
                    <TabsContent value="terrain" className="flex-1 mt-0">
                      <TerrainLibrary 
                        selectedTerrain={selectedTerrain}
                        onTerrainSelect={setSelectedTerrain}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isCompact && (
          <MobileNavigation
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
            activeLibrary={activeLibrary}
            onLibraryChange={handleLibraryChange}
          />
        )}

        <WelcomeModal 
          open={showWelcome}
          onClose={handleWelcomeClose}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
