import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import MultiVerticalOverview from "./pages/MultiVerticalOverview";
import UsersRoles from "./pages/UsersRoles";
import Contacts from "./pages/Contacts";
import Donations from "./pages/Donations";
import FeesSubsidies from "./pages/FeesSubsidies";
import Volunteers from "./pages/Volunteers";
import Procurement from "./pages/Procurement";
import HR from "./pages/HR";
import Programs from "./pages/Programs";
import Safeguarding from "./pages/Safeguarding";
import Exceptions from "./pages/Exceptions";
import Messaging from "./pages/Messaging";
import AuditLog from "./pages/AuditLog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/verticals" element={<MultiVerticalOverview />} />
              <Route path="/users" element={<UsersRoles />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/fees" element={<FeesSubsidies />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/hr" element={<HR />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/safeguarding" element={<Safeguarding />} />
              <Route path="/exceptions" element={<Exceptions />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/audit" element={<AuditLog />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
