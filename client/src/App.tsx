import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Chapter1 from "@/pages/Chapter1";
import Chapter2 from "@/pages/Chapter2";
import Chapter3 from "@/pages/Chapter3";
import Chapter4 from "@/pages/Chapter4";
import Finale from "@/pages/Finale";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chapter/1" component={Chapter1} />
      <Route path="/chapter/2" component={Chapter2} />
      <Route path="/chapter/3" component={Chapter3} />
      <Route path="/chapter/4" component={Chapter4} />
      <Route path="/finale" component={Finale} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
