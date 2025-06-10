
import { useState } from "react";
import { Header } from "@/components/Header";
import { PlantLibrary } from "@/components/PlantLibrary";
import { Canvas } from "@/components/Canvas";
import { Toolbar } from "@/components/Toolbar";
import { WelcomeModal } from "@/components/WelcomeModal";

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <Toolbar 
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
          <div className="flex-1 p-4">
            <Canvas 
              selectedTool={selectedTool}
              selectedPlant={selectedPlant}
              onPlantUsed={() => setSelectedPlant(null)}
            />
          </div>
        </div>

        {/* Plant Library Sidebar */}
        <div className="w-80 border-l border-border bg-card">
          <PlantLibrary 
            selectedPlant={selectedPlant}
            onPlantSelect={setSelectedPlant}
          />
        </div>
      </div>

      <WelcomeModal 
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
    </div>
  );
};

export default Index;
