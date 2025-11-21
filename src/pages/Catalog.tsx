import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - will be replaced with Google Sheets integration
  const products = [
    {
      id: "1",
      name: "Premium Cotton T-Shirt",
      category: "Apparel",
      price: "₹299",
      moq: 100,
      supplier: "Fashion Exports Ltd",
      status: "approved",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    {
      id: "2",
      name: "Steel Water Bottle",
      category: "Home & Kitchen",
      price: "₹450",
      moq: 50,
      supplier: "Metal Works India",
      status: "approved",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"
    },
    {
      id: "3",
      name: "Organic Spice Mix",
      category: "Food & Beverages",
      price: "₹180",
      moq: 200,
      supplier: "Spice Masters",
      status: "pending",
      image: "https://images.unsplash.com/photo-1596040033229-a0b0c9b92e1a?w=400"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Product Catalog</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search products or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <Badge variant={product.status === "approved" ? "default" : "secondary"}>
                    {product.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-lg">{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MOQ:</span>
                    <span className="font-medium">{product.moq} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier:</span>
                    <span className="text-sm">{product.supplier}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/product/${product.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
