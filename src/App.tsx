
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PatientProvider } from "@/contexts/PatientContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import { BillingProvider } from "@/contexts/BillingContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PatientProvider>
        <AppointmentProvider>
          <BillingProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/patients" 
                  element={
                    <Layout>
                      <Patients />
                    </Layout>
                  } 
                />
                <Route 
                  path="/patients/:id" 
                  element={
                    <Layout>
                      <PatientDetail />
                    </Layout>
                  } 
                />
                <Route 
                  path="/appointments" 
                  element={
                    <Layout>
                      <Appointments />
                    </Layout>
                  } 
                />
                <Route 
                  path="/billing" 
                  element={
                    <Layout>
                      <Billing />
                    </Layout>
                  } 
                />
                <Route 
                  path="/documents" 
                  element={
                    <Layout>
                      <Documents />
                    </Layout>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <Layout>
                      <Reports />
                    </Layout>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BillingProvider>
        </AppointmentProvider>
      </PatientProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
