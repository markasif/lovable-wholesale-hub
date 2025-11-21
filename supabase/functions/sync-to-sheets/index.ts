import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleSpreadsheet } from "npm:google-spreadsheet@4.1.1";
import { JWT } from "npm:google-auth-library@9";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sheetName, data } = await req.json();

    console.log(`Syncing to sheet: ${sheetName}`, data);

    // Parse service account credentials
    const serviceAccountAuth = JSON.parse(
      Deno.env.get('GOOGLE_SHEETS_SERVICE_ACCOUNT') ?? '{}'
    );

    // Initialize auth
    const jwt = new JWT({
      email: serviceAccountAuth.client_email,
      key: serviceAccountAuth.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Get spreadsheet ID from environment (you'll need to add this)
    const spreadsheetId = Deno.env.get('GOOGLE_SHEETS_SPREADSHEET_ID');

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured');
    }

    const doc = new GoogleSpreadsheet(spreadsheetId, jwt);
    await doc.loadInfo();

    // Get or create sheet
    let sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      sheet = await doc.addSheet({ title: sheetName });
      console.log(`Created new sheet: ${sheetName}`);
    }

    // Add row to sheet
    await sheet.addRow(data);

    console.log(`Successfully synced to ${sheetName}`);

    return new Response(
      JSON.stringify({ success: true, sheet: sheetName }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in sync-to-sheets:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});