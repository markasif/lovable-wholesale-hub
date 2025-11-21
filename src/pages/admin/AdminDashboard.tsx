import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      // Fetch pending supplier/buyer approvals
      const { data: approvals, error: approvalsError } = await supabase
        .from('pending_approvals')
        .select('*, profiles(email, company_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (approvalsError) throw approvalsError;

      // Fetch pending products
      const { data: products, error: productsError } = await supabase
        .from('product_review_queue')
        .select('*, profiles(email, company_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setPendingApprovals(approvals || []);
      setPendingProducts(products || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (approvalId: string, action: 'approve' | 'reject', approval: any) => {
    try {
      const isApproved = action === 'approve';

      // Update pending_approvals status
      const { error: updateError } = await supabase
        .from('pending_approvals')
        .update({
          status: isApproved ? 'approved' : 'rejected',
          rejection_reason: isApproved ? null : 'Admin rejected'
        })
        .eq('id', approvalId);

      if (updateError) throw updateError;

      if (isApproved) {
        // Assign role to user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: approval.user_id,
            role: approval.approval_type
          });

        if (roleError) throw roleError;

        // Sync to Google Sheets
        await supabase.functions.invoke('sync-to-sheets', {
          body: {
            sheetName: approval.approval_type === 'supplier' ? 'Active_Suppliers' : 'Active_Buyers',
            data: {
              company_name: approval.company_name,
              contact_person: approval.contact_person,
              email: approval.email,
              phone: approval.phone,
              gst: approval.gst,
              approved_at: new Date().toISOString()
            }
          }
        });

        // Send notification
        await supabase.functions.invoke('send-notification', {
          body: {
            type: approval.approval_type === 'supplier' ? 'supplier_approved' : 'buyer_approved',
            data: {
              email: approval.email,
              companyName: approval.company_name
            }
          }
        });
      }

      toast({
        title: isApproved ? "Approved!" : "Rejected",
        description: `${approval.approval_type === 'supplier' ? 'Supplier' : 'Buyer'} application ${isApproved ? 'approved' : 'rejected'} successfully`
      });

      fetchPendingData();
    } catch (error: any) {
      console.error('Error handling approval:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleProductAction = async (productId: string, action: 'approve' | 'reject', product: any) => {
    try {
      const isApproved = action === 'approve';

      if (isApproved) {
        // Move product to catalog
        const { error: catalogError } = await supabase
          .from('product_catalog')
          .insert({
            supplier_id: product.supplier_id,
            product_name: product.product_name,
            category: product.category,
            description: product.description,
            price: product.price,
            moq: product.moq,
            images: product.images
          });

        if (catalogError) throw catalogError;

        // Update product review queue
        const { error: updateError } = await supabase
          .from('product_review_queue')
          .update({ status: 'approved' })
          .eq('id', productId);

        if (updateError) throw updateError;

        // Sync to Google Sheets
        await supabase.functions.invoke('sync-to-sheets', {
          body: {
            sheetName: 'Product_Catalog',
            data: {
              product_name: product.product_name,
              category: product.category,
              price: product.price,
              moq: product.moq,
              supplier: product.profiles?.company_name || 'Unknown',
              approved_at: new Date().toISOString()
            }
          }
        });

        // Send Telegram notification
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'product_approved',
            data: {
              productName: product.product_name,
              category: product.category,
              price: product.price,
              moq: product.moq,
              supplierName: product.profiles?.company_name || 'Unknown'
            }
          }
        });
      } else {
        const { error: updateError } = await supabase
          .from('product_review_queue')
          .update({
            status: 'rejected',
            rejection_reason: 'Admin rejected'
          })
          .eq('id', productId);

        if (updateError) throw updateError;
      }

      toast({
        title: isApproved ? "Product Approved!" : "Product Rejected",
        description: `${product.product_name} ${isApproved ? 'approved and added to catalog' : 'rejected'}`
      });

      fetchPendingData();
    } catch (error: any) {
      console.error('Error handling product:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review supplier and buyer applications</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApprovals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending approvals</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>GST Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((approval) => (
                        <TableRow key={approval.id}>
                          <TableCell>
                            <Badge variant="outline">
                              {approval.approval_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{approval.company_name}</TableCell>
                          <TableCell>
                            {approval.gst_validation_status === 'valid' && (
                              <Badge variant="default">Valid</Badge>
                            )}
                            {approval.gst_validation_status === 'invalid' && (
                              <Badge variant="destructive">Invalid</Badge>
                            )}
                            {approval.gst_validation_status === 'pending' && (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApprovalAction(approval.id, 'approve', approval)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleApprovalAction(approval.id, 'reject', approval)}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Product Approvals</CardTitle>
                <CardDescription>Review and approve new product listings</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingProducts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending products</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>MOQ</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.product_name}</TableCell>
                          <TableCell>{product.profiles?.company_name || 'Unknown'}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>{product.moq} units</TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleProductAction(product.id, 'approve', product)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleProductAction(product.id, 'reject', product)}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;