import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import SupplierSignup from "./pages/supplier/SupplierSignup";
import AddProduct from "./pages/supplier/AddProduct";
import BuyerSignup from "./pages/buyer/BuyerSignup";
import NewOrder from "./pages/order/NewOrder";
import OrderSuccess from "./pages/order/OrderSuccess";
import Tracking from "./pages/Tracking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/supplier/signup" element={<SupplierSignup />} />
          <Route path="/supplier/add-product" element={<AddProduct />} />
          <Route path="/buyer/signup" element={<BuyerSignup />} />
          <Route path="/order/new" element={<NewOrder />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
