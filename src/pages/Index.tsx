
import { useState } from "react";
import { Header } from "@/components/Header";
import { PlantLibrary } from "@/components/PlantLibrary";
import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { WelcomeModal } from "@/components/WelcomeModal";
import { TerrainLibrary } from "@/components/TerrainLibrary";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeLibrary, setActiveLibrary] = useState<"plants" | "terrain">("plants");

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    if (tool === "terrain") {
      setActiveLibrary("terrain");
    } else if (tool === "select" || tool === "rectangle" || tool === "circle") {
      setActiveLibrary("plants");
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <Header />
        
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <Toolbar 
              selectedTool={selectedTool}
              onToolSelect={handleToolSelect}
            />
            <div className="flex-1 p-2 sm:p-4">
              <Canvas 
                selectedTool={selectedTool}
                selectedPlant={selectedPlant}
                selectedTerrain={selectedTerrain}
                onPlantUsed={() => setSelectedPlant(null)}
                onTerrainUsed={() => setSelectedTerrain(null)}
              />
            </div>
          </div>

          {/* Dynamic Sidebar */}
          <div className="w-full lg:w-80 h-96 lg:h-auto border-t lg:border-t-0 lg:border-l border-border bg-card transition-colors">
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
        </div>

        <WelcomeModal 
          open={showWelcome}
          onClose={() => setShowWelcome(false)}
        />
      </div>
    </ThemeProvider>
  );
};

export default Index;
