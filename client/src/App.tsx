import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Route path="/">
            <Index />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route>
            <NotFound />
          </Route>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
