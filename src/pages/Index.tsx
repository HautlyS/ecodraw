import React, { useState, useCallback, useMemo, memo, useRef } from "react";
import { Plant, Terrain, Structure } from "@/types/canvasTypes";
import { UnifiedToolbar } from "@/components/UnifiedToolbar";
import { PlantLibrary } from "@/components/PlantLibrary";
import { Canvas, CanvasRef } from "@/components/Canvas";
import { WelcomeModal } from "@/components/WelcomeModal";
import { TerrainLibrary } from "@/components/TerrainLibrary";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StructureLibrary } from "@/components/StructureLibrary";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Leaf, Mountain, Building, Sparkles, X } from "lucide-react";
import Joyride, { STATUS } from 'react-joyride';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MemoizedCanvas = memo(Canvas);
const MemoizedPlantLibrary = memo(PlantLibrary);
const MemoizedTerrainLibrary = memo(TerrainLibrary);
const MemoizedStructuresLibrary = memo(StructureLibrary);

const Index = () => {
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeLibrary, setActiveLibrary] = useState<"plants" | "terrain" | "structures">("plants");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 50, height: 30 });
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);
  const canvasRef = useRef<CanvasRef>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const analyticsData = useMemo(() => {
    const elements = canvasRef.current?.getState() || [];
    const plantCount = elements.filter(e => e.type === 'plant').length;
    const terrainArea = elements.filter(e => e.type === 'terrain').reduce((sum, e) => sum + (e.realWorldWidth * e.realWorldHeight), 0);
    const structureCount = elements.filter(e => e.type === 'structure').length;
    
    return [
      { name: 'Plantas', value: plantCount, color: '#22c55e' },
      { name: 'Terreno (m²)', value: Math.round(terrainArea), color: '#f59e0b' },
      { name: 'Estruturas', value: structureCount, color: '#3b82f6' },
    ];
  }, []);

  const tourSteps = [
    {
      target: '.layout-container',
      content: 'Bem-vindo ao Agroecologia Planner! Vamos fazer um tour rápido.',
    },
    {
      target: '.unified-toolbar',
      content: 'Esta é a barra de ferramentas principal. Aqui você seleciona ferramentas como selecionar, desenhar formas e mais.',
    },
    {
      target: '.canvas-area',
      content: 'Esta é a área do canvas onde você cria seu planejamento. Use o mouse para interagir.',
    },
    {
      target: '.sidebar',
      content: 'Aqui está a biblioteca de itens. Selecione plantas, terrenos ou estruturas para adicionar ao canvas.',
    },
    {
      target: '.export-button',
      content: 'Quando terminar, use este botão para exportar seu projeto como imagem.',
    },
  ];

  const { isMobile, isTablet } = useResponsive();
  const isCompact = isMobile || isTablet;

  const handleExportCanvas = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.exportFullCanvas();
    }
  }, []);

  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
    if (tool === "terrain") {
      setActiveLibrary("terrain");
    } else if (tool === "select" || tool === "rectangle" || tool === "circle") {
      setActiveLibrary("plants");
    }
  }, []);

  const handleLibraryChange = useCallback((library: "plants" | "terrain" | "structures") => {
    setActiveLibrary(library);
    if (library === "terrain" && selectedTool !== "terrain") {
      setSelectedTool("terrain");
    } else if (library === "plants" && selectedTool === "terrain") {
      setSelectedTool("select");
    } else if (library === "structures" && selectedTool === "terrain") {
      setSelectedTool("select");
    }
    
    // Show mobile library when changing library on mobile
    if (isCompact) {
      setShowMobileLibrary(true);
    }
  }, [selectedTool, isCompact]);

  const handlePlantUsed = useCallback(() => {
    if (isCompact) {
      setShowMobileLibrary(false);
    }
  }, [isCompact]);

  const handleTerrainUsed = useCallback(() => {
    if (isCompact) {
      setShowMobileLibrary(false);
    }
  }, [isCompact]);

  const handleStructureUsed = useCallback(() => {
    if (isCompact) {
      setShowMobileLibrary(false);
    }
  }, [isCompact]);

  const handleWelcomeClose = useCallback(() => {
    setShowWelcome(false);
    setRunTour(true);
  }, []);
  
  const handleCanvasSizeChange = useCallback((size: { width: number; height: number }) => {
    setCanvasSize(size);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const toggleMobileLibrary = useCallback(() => {
    setShowMobileLibrary(prev => !prev);
  }, []);

  const closeMobileLibrary = useCallback(() => {
    setShowMobileLibrary(false);
  }, []);

  // Memoized sidebar content with enhanced styling
  const sidebarContent = useMemo(() => (
    <div className="h-full flex flex-col">
      <Tabs 
        value={activeLibrary} 
        onValueChange={(value) => handleLibraryChange(value as "plants" | "terrain" | "structures")} 
        className="flex-1 flex flex-col"
      >
        <div className="sticky top-0 z-10 mx-4 mt-4 mb-2 space-y-3 bg-gradient-to-b from-white/90 to-transparent dark:from-gray-900/90 backdrop-blur-xl pt-2 pb-4 rounded-2xl">
          {/* Enhanced Tab Navigation */}
          <div className="space-y-2">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-lg border border-white/20 dark:border-gray-700/20 rounded-2xl p-1">
              <TabsTrigger 
                value="plants" 
                className="flex items-center gap-2 text-sm font-semibold rounded-xl h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Plantas</span>
              </TabsTrigger>
              <TabsTrigger 
                value="terrain" 
                className="flex items-center gap-2 text-sm font-semibold rounded-xl h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mountain className="h-4 w-4" />
                <span className="hidden sm:inline">Terreno</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex justify-center">
              <TabsList className="w-48 h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-lg border border-white/20 dark:border-gray-700/20 rounded-2xl p-1">
                <TabsTrigger 
                  value="structures" 
                  className="flex items-center gap-2 text-sm font-semibold rounded-xl h-10 w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Building className="h-4 w-4" />
                  <span>Estruturas</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

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

        <TabsContent value="structures" className="flex-1 mt-0">
          <MemoizedStructuresLibrary
            selectedStructure={selectedStructure}
            onStructureSelect={setSelectedStructure}
            className="flex-1"
          />
        </TabsContent>
      </Tabs>
    </div>
  ), [activeLibrary, selectedPlant, selectedTerrain, selectedStructure, handleLibraryChange]);

  // Enhanced mobile library modal
  const mobileLibraryModal = useMemo(() => (
    <div className={cn(
      "fixed inset-0 z-50 transition-all duration-300",
      showMobileLibrary ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closeMobileLibrary}
      />
      
      {/* Modal */}
      <div className={cn(
        "absolute inset-x-4 top-4 bottom-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl transition-all duration-300",
        showMobileLibrary ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              Bibliotecas
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileLibrary}
            className="h-10 w-10 p-0 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {sidebarContent}
        </div>
      </div>
    </div>
  ), [showMobileLibrary, sidebarContent, closeMobileLibrary]);

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden layout-container">
        {/* Enhanced Unified Toolbar */}
        <UnifiedToolbar 
          selectedTool={selectedTool}
          onToolSelect={handleToolSelect}
          onUndo={() => canvasRef.current?.undo()}
          onRedo={() => canvasRef.current?.redo()}
          canUndo={canUndo}
          canRedo={canRedo}
          canvasSize={canvasSize}
          onCanvasSizeChange={handleCanvasSizeChange}
        />

        {/* Main Content with Glass Morphism */}
        <div className="flex-1 flex min-h-0 relative">
          {/* Canvas with enhanced styling */}
          <div className="flex-1 relative canvas-area">
            <Canvas 
              ref={canvasRef}
              selectedTool={selectedTool}
              selectedPlant={selectedPlant}
              selectedTerrain={selectedTerrain}
              selectedStructure={selectedStructure}
              onPlantUsed={handlePlantUsed}
              onTerrainUsed={handleTerrainUsed}
              onStructureUsed={handleStructureUsed}
              onToolChange={handleToolSelect}
              canvasSize={canvasSize}
              onCanvasSizeChange={handleCanvasSizeChange}
              onHistoryChange={(cu, cr) => {
                setCanUndo(cu);
                setCanRedo(cr);
              }}
            />
          </div>

          {/* Enhanced Desktop Sidebar */}
          {!isCompact && (
            <div className={cn(
              "sidebar transition-all duration-500 ease-in-out relative",
              "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl",
              "border-l border-white/20 dark:border-gray-700/20",
              "max-w-[400px] min-w-0",
              sidebarCollapsed ? "w-0 overflow-hidden" : "w-96"
            )}>
              {/* Enhanced Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className={cn(
                  "absolute top-6 z-20 h-12 w-12 rounded-2xl transition-all duration-300",
                  "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
                  "border border-white/20 dark:border-gray-700/20 shadow-lg",
                  "hover:shadow-xl hover:scale-110 hover:bg-white/90 dark:hover:bg-gray-700/90",
                  sidebarCollapsed ? "-left-6" : "left-6"
                )}
              >
                {sidebarCollapsed ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>

              {/* Sidebar Content */}
              {!sidebarCollapsed && (
                <div className="h-full pt-4">
                  {sidebarContent}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Mobile Navigation */}
        {isCompact && (
          <MobileNavigation
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
            activeLibrary={activeLibrary}
            onLibraryChange={handleLibraryChange}
            onShowLibrary={toggleMobileLibrary}
          />
        )}

        {/* Mobile Library Modal */}
        {isCompact && mobileLibraryModal}

        {/* Enhanced Welcome Modal */}
        <WelcomeModal 
          open={showWelcome}
          onClose={handleWelcomeClose}
        />

        {/* Analytics Dialog */}
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Estatísticas do Projeto</DialogTitle>
            </DialogHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </DialogContent>
        </Dialog>

        {/* Guided Tour */}
        <Joyride
          steps={tourSteps}
          run={runTour}
          continuous
          showProgress
          showSkipButton
          callback={(data) => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              setRunTour(false);
            }
          }}
          styles={{
            options: {
              primaryColor: '#10b981',
            }
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default memo(Index);