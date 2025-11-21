import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Shield } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">B2B Portal</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalog" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/tracking" className="text-foreground hover:text-primary transition-colors">
              Track Order
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/supplier/signup">
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Become a Supplier
              </Button>
            </Link>
            <Link to="/buyer/signup">
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Register as Buyer
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
