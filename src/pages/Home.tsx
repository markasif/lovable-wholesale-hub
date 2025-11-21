import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, TrendingUp, Shield, Truck, FileText } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          Your Complete B2B Wholesale Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect suppliers with verified buyers. Manage products, orders, and shipping with complete automation.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/catalog">
            <Button size="lg" className="text-lg px-8">
              Browse Products
            </Button>
          </Link>
          <Link to="/supplier/signup">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Start Selling
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Package className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription>
                Easy onboarding and product listing with instant admin approval workflow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-success mb-4" />
              <CardTitle>Buyer KYC</CardTitle>
              <CardDescription>
                AI-powered GST validation and address verification for trusted buyers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <ShoppingCart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Smart Ordering</CardTitle>
              <CardDescription>
                MOQ validation, automated emails, and real-time order tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="h-12 w-12 text-warning mb-4" />
              <CardTitle>Shipping Automation</CardTitle>
              <CardDescription>
                Export data for label generation and automated tracking updates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-success mb-4" />
              <CardTitle>Marketing Tools</CardTitle>
              <CardDescription>
                Integrated Canva posters and automated social media scheduling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Complete Accounting</CardTitle>
              <CardDescription>
                Automated accounting sheets with real-time order and payment tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join hundreds of suppliers and buyers on our platform
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/supplier/signup">
              <Button size="lg" variant="secondary">
                Register as Supplier
              </Button>
            </Link>
            <Link to="/buyer/signup">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                Register as Buyer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
