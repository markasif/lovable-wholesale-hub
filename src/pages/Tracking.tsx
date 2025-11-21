import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle } from "lucide-react";

const Tracking = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = () => {
    // Mock tracking data - will be replaced with Google Sheets integration
    setTrackingData({
      orderId: orderId,
      status: "in_transit",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2025-01-25",
      updates: [
        { date: "2025-01-20", status: "Order Placed", completed: true },
        { date: "2025-01-21", status: "Processing", completed: true },
        { date: "2025-01-22", status: "Shipped", completed: true },
        { date: "2025-01-23", status: "In Transit", completed: false },
        { date: "2025-01-25", status: "Out for Delivery", completed: false },
        { date: "2025-01-25", status: "Delivered", completed: false }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="orderId">Order ID or Tracking Number</Label>
                <Input
                  id="orderId"
                  placeholder="Enter order ID..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleTrack}>Track Order</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {trackingData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{trackingData.orderId}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tracking: {trackingData.trackingNumber}
                  </p>
                </div>
                <Badge variant={trackingData.status === "delivered" ? "default" : "secondary"}>
                  {trackingData.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg font-semibold">{trackingData.estimatedDelivery}</p>
              </div>

              <div className="space-y-4">
                {trackingData.updates.map((update: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {update.completed ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-muted" />
                      )}
                      {index < trackingData.updates.length - 1 && (
                        <div className={`w-0.5 h-12 ${update.completed ? 'bg-success' : 'bg-muted'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium">{update.status}</p>
                      <p className="text-sm text-muted-foreground">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tracking;
