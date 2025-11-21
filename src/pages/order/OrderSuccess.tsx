import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        
        <Card className="text-left">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold">Seller Notified</p>
                <p className="text-sm text-muted-foreground">
                  The seller has received your order via email and will process it shortly
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold">Order Confirmation</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive an email confirmation with order details and invoice
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold">Shipping Updates</p>
                <p className="text-sm text-muted-foreground">
                  Track your order status and receive automated tracking updates via email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/catalog">
            <Button variant="outline">Browse More Products</Button>
          </Link>
          <Link to="/tracking">
            <Button>Track Order</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
