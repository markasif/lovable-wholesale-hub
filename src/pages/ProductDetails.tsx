import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, Shield } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();

  // Mock data - will be replaced with Google Sheets integration
  const product = {
    id: id,
    name: "Premium Cotton T-Shirt",
    category: "Apparel",
    price: "₹299",
    moq: 100,
    supplier: "Fashion Exports Ltd",
    status: "approved",
    description: "High-quality 100% cotton t-shirts, perfect for wholesale. Available in multiple sizes and colors. Durable stitching and pre-shrunk fabric.",
    specifications: [
      { label: "Material", value: "100% Cotton" },
      { label: "Sizes Available", value: "S, M, L, XL, XXL" },
      { label: "Colors", value: "10+ colors" },
      { label: "Packaging", value: "Individual poly bags" }
    ],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
              <Badge variant={product.status === "approved" ? "default" : "secondary"}>
                {product.status}
              </Badge>
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              {product.price} <span className="text-lg text-muted-foreground">per unit</span>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">MOQ</p>
                      <p className="font-semibold">{product.moq} units</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Shipping</p>
                      <p className="font-semibold">Available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Supplier</p>
                      <p className="font-semibold">{product.supplier}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-0">
                      <dt className="text-muted-foreground">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Link to={`/order/new?productId=${product.id}`}>
              <Button size="lg" className="w-full">
                Place Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
