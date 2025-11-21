import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const NewOrder = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    quantity: "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: "",
    notes: ""
  });

  // Mock product data
  const product = {
    name: "Premium Cotton T-Shirt",
    price: 299,
    moq: 100
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const quantity = parseInt(formData.quantity);
    
    if (quantity < product.moq) {
      toast({
        title: "MOQ Not Met",
        description: `Minimum order quantity is ${product.moq} units`,
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.buyerName || !formData.buyerEmail || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // TODO: Integrate with Google Sheets API
    // TODO: Send email to seller
    console.log("Order data:", formData);

    setTimeout(() => {
      toast({
        title: "Order Placed!",
        description: "Seller has been notified. You'll receive order confirmation via email."
      });
      setIsLoading(false);
      navigate("/order/success");
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const totalAmount = product.price * (parseInt(formData.quantity) || 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Place Order</CardTitle>
                <CardDescription>
                  Fill in your details to complete the order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="buyerName">Your Name *</Label>
                      <Input
                        id="buyerName"
                        name="buyerName"
                        value={formData.buyerName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buyerEmail">Email *</Label>
                      <Input
                        id="buyerEmail"
                        name="buyerEmail"
                        type="email"
                        value={formData.buyerEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buyerPhone">Phone *</Label>
                      <Input
                        id="buyerPhone"
                        name="buyerPhone"
                        type="tel"
                        value={formData.buyerPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min={product.moq}
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        MOQ: {product.moq} units
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Shipping Address *</Label>
                    <Input
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Product ID: {productId}</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per unit</span>
                    <span className="font-medium">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{formData.quantity || 0} units</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold text-lg text-primary">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
