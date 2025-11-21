import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    console.log(`Sending ${type} notification`, data);

    let result: { email: any; telegram: any } = { email: null, telegram: null };

    // Send email notifications
    if (type === 'buyer_approved' || type === 'supplier_approved' || type === 'buyer_rejected') {
      const emailSubjects: Record<string, string> = {
        buyer_approved: 'Your Buyer Application Approved! 🎉',
        supplier_approved: 'Your Supplier Application Approved! 🎉',
        buyer_rejected: 'Buyer Application Status Update'
      };

      const emailBodies: Record<string, string> = {
        buyer_approved: `
          <h1>Congratulations!</h1>
          <p>Your buyer application for <strong>${data.companyName}</strong> has been approved.</p>
          <p>You can now start placing orders on our platform.</p>
        `,
        supplier_approved: `
          <h1>Congratulations!</h1>
          <p>Your supplier application for <strong>${data.companyName}</strong> has been approved.</p>
          <p>You can now start listing products on our platform.</p>
        `,
        buyer_rejected: `
          <h1>Application Update</h1>
          <p>We're sorry, but your buyer application for <strong>${data.companyName}</strong> has been rejected.</p>
          <p><strong>Reason:</strong> ${data.rejectionReason || 'Not specified'}</p>
          <p>Please contact support if you have any questions.</p>
        `
      };

      const emailResponse = await resend.emails.send({
        from: 'B2B Portal <onboarding@resend.dev>',
        to: [data.email],
        subject: emailSubjects[type],
        html: emailBodies[type],
      });

      result.email = emailResponse;
      console.log('Email sent:', emailResponse);
    }

    // Send email for new order
    if (type === 'new_order') {
      const emailResponse = await resend.emails.send({
        from: 'B2B Portal <onboarding@resend.dev>',
        to: [data.supplierEmail],
        subject: 'New Order Received! 📦',
        html: `
          <h1>New Order Received</h1>
          <p>You have received a new order:</p>
          <ul>
            <li><strong>Product:</strong> ${data.productName}</li>
            <li><strong>Quantity:</strong> ${data.quantity}</li>
            <li><strong>Total Amount:</strong> ₹${data.totalAmount}</li>
            <li><strong>Buyer:</strong> ${data.buyerName}</li>
          </ul>
          <p>Please log in to your dashboard to view and process this order.</p>
        `,
      });

      result.email = emailResponse;
      console.log('Order email sent:', emailResponse);
    }

    // Send tracking email to buyer
    if (type === 'tracking_updated') {
      const emailResponse = await resend.emails.send({
        from: 'B2B Portal <onboarding@resend.dev>',
        to: [data.buyerEmail],
        subject: 'Order Tracking Updated 🚚',
        html: `
          <h1>Your Order Has Been Shipped!</h1>
          <p>Your order has been shipped and is on its way.</p>
          <ul>
            <li><strong>Tracking Number:</strong> ${data.trackingNumber}</li>
            <li><strong>Tracking URL:</strong> <a href="${data.trackingUrl}">${data.trackingUrl}</a></li>
          </ul>
          <p>You can track your shipment using the link above.</p>
        `,
      });

      result.email = emailResponse;
      console.log('Tracking email sent:', emailResponse);
    }

    // Send Telegram notification for new product
    if (type === 'product_approved' && telegramToken && telegramChatId) {
      const message = `🆕 New Product Approved!\n\nProduct: ${data.productName}\nCategory: ${data.category}\nPrice: ₹${data.price}\nMOQ: ${data.moq}\n\nSupplier: ${data.supplierName}`;

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
          }),
        }
      );

      result.telegram = await telegramResponse.json();
      console.log('Telegram sent:', result.telegram);
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in send-notification:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});