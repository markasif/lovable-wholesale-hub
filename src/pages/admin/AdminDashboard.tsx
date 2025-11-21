import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Package, Users, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();

  // Mock data - will be replaced with Google Sheets integration
  const pendingApprovals = {
    suppliers: [
      { id: 1, name: "Fashion Exports Ltd", email: "contact@fashionexports.com", date: "2025-01-20" }
    ],
    buyers: [
      { id: 1, name: "Retail Corp", email: "buyer@retailcorp.com", gst: "27AABCU9603R1ZX", date: "2025-01-21" }
    ],
    products: [
      { id: 1, name: "Premium Cotton T-Shirt", supplier: "Fashion Exports Ltd", price: "₹299", date: "2025-01-22" }
    ]
  };

  const stats = [
    { label: "Total Suppliers", value: "24", icon: Package, color: "text-primary" },
    { label: "Total Buyers", value: "156", icon: Users, color: "text-success" },
    { label: "Total Orders", value: "892", icon: ShoppingCart, color: "text-warning" },
    { label: "Pending Approvals", value: "3", icon: Clock, color: "text-destructive" }
  ];

  const handleApprove = (type: string, id: number) => {
    // TODO: Update Google Sheets
    // TODO: Send approval email
    toast({
      title: "Approved!",
      description: `${type} has been approved and notified via email.`
    });
  };

  const handleReject = (type: string, id: number) => {
    // TODO: Update Google Sheets
    toast({
      title: "Rejected",
      description: `${type} has been rejected.`,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Suppliers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pending Supplier Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove("Supplier", supplier.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1 text-success" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject("Supplier", supplier.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1 text-destructive" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Buyers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pending Buyer Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.buyers.map((buyer) => (
                  <TableRow key={buyer.id}>
                    <TableCell className="font-medium">{buyer.name}</TableCell>
                    <TableCell>{buyer.email}</TableCell>
                    <TableCell>{buyer.gst}</TableCell>
                    <TableCell>{buyer.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove("Buyer", buyer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1 text-success" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject("Buyer", buyer.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1 text-destructive" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Products */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Product Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove("Product", product.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1 text-success" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject("Product", product.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1 text-destructive" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
