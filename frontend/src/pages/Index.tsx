
import { useState } from "react";
import { Header } from "@/components/Header";
import { PlantLibrary } from "@/components/PlantLibrary";
import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { WelcomeModal } from "@/components/WelcomeModal";
import { TerrainLibrary } from "@/components/TerrainLibrary";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeLibrary, setActiveLibrary] = useState<"plants" | "terrain">("plants");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { isMobile, isTablet, screenHeight } = useResponsive();
  const isCompact = isMobile || isTablet;

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    if (tool === "terrain") {
      setActiveLibrary("terrain");
    } else if (tool === "select" || tool === "rectangle" || tool === "circle") {
      setActiveLibrary("plants");
    }
  };

  const handleLibraryChange = (library: "plants" | "terrain") => {
    setActiveLibrary(library);
    // Auto-switch to appropriate tool when changing libraries
    if (library === "terrain" && selectedTool !== "terrain") {
      setSelectedTool("terrain");
    } else if (library === "plants" && selectedTool === "terrain") {
      setSelectedTool("select");
    }
  };

  // Calculate dynamic heights based on screen size and mobile considerations
  const headerHeight = isCompact ? "3.5rem" : "4rem";
  const toolbarHeight = isCompact ? "0" : "auto"; // Hide toolbar on mobile
  const mobileNavHeight = isCompact ? "4rem" : "0";
  const availableHeight = `calc(100vh - ${headerHeight} - ${toolbarHeight} - ${mobileNavHeight} - env(safe-area-inset-top) - env(safe-area-inset-bottom))`;
  const dynamicHeight = `calc(var(--vh, 1vh) * 100 - ${headerHeight} - ${toolbarHeight} - ${mobileNavHeight} - env(safe-area-inset-top) - env(safe-area-inset-bottom))`;

  return (
    <ThemeProvider>
      <div className="min-h-screen-dynamic bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 transition-colors overflow-hidden">
        <Header />
        
        <div 
          className={cn(
            "flex transition-all duration-300",
            isCompact ? "flex-col h-full" : "flex-col lg:flex-row"
          )}
          style={{ 
            height: availableHeight,
            minHeight: dynamicHeight 
          }}
        >
          {/* Desktop Toolbar - Hidden on mobile */}
          {!isCompact && (
            <Toolbar 
              selectedTool={selectedTool}
              onToolSelect={handleToolSelect}
            />
          )}

          {/* Main Content Area */}
          <div className={cn(
            "flex flex-1 min-h-0 transition-all duration-300",
            isCompact ? "flex-col" : "flex-col lg:flex-row"
          )}>
            {/* Canvas Area */}
            <div className={cn(
              "flex-1 flex flex-col min-h-0 transition-all duration-300",
              isCompact ? "h-full" : ""
            )}>
              <div className={cn(
                "flex-1 transition-all duration-300",
                isCompact ? "p-1 h-full" : "p-2 sm:p-4"
              )}>
                <Canvas 
                  selectedTool={selectedTool}
                  selectedPlant={selectedPlant}
                  selectedTerrain={selectedTerrain}
                  onPlantUsed={() => setSelectedPlant(null)}
                  onTerrainUsed={() => setSelectedTerrain(null)}
                  onToolChange={handleToolSelect}
                />
              </div>
            </div>

            {/* Sidebar - Hidden on mobile, shown on desktop */}
            {!isCompact && (
              <div className={cn(
                "border-border bg-card transition-all duration-300",
                sidebarCollapsed 
                  ? "w-0 overflow-hidden border-l-0" // Desktop: collapsed
                  : "w-80 border-l" // Desktop: expanded
              )}>
                {/* Collapse button for desktop */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-card border border-l-0 rounded-r-md",
                    "flex items-center justify-center text-muted-foreground hover:text-foreground",
                    "transition-all duration-300",
                    sidebarCollapsed ? "-right-6" : "-left-6"
                  )}
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <div className={cn(
                    "w-3 h-3 transition-transform duration-300",
                    sidebarCollapsed ? "rotate-0" : "rotate-180"
                  )}>
                    &#8250;
                  </div>
                </button>

                {/* Library Content */}
                {!sidebarCollapsed && (
                  <>
                    {/* Desktop Library Switcher */}
                    <div className="p-3 border-b border-border">
                      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                        <button
                          onClick={() => handleLibraryChange("plants")}
                          className={cn(
                            "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                            activeLibrary === "plants"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          🌱 Plantas
                        </button>
                        <button
                          onClick={() => handleLibraryChange("terrain")}
                          className={cn(
                            "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                            activeLibrary === "terrain"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          🏔️ Terreno
                        </button>
                      </div>
                    </div>

                    {/* Library Component */}
                    <div className="flex-1 overflow-hidden">
                      {activeLibrary === "plants" ? (
                        <PlantLibrary 
                          selectedPlant={selectedPlant}
                          onPlantSelect={setSelectedPlant}
                        />
                      ) : (
                        <TerrainLibrary 
                          selectedTerrain={selectedTerrain}
                          onTerrainSelect={setSelectedTerrain}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Only shown on mobile */}
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
          onClose={() => setShowWelcome(false)}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
