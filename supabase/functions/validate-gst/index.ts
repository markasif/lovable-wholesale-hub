import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gstNumber, approvalId } = await req.json();

    console.log(`Validating GST: ${gstNumber} for approval: ${approvalId}`);

    // Simple GST format validation (15 characters alphanumeric)
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const isValid = gstRegex.test(gstNumber);

    const validation = {
      isValid,
      message: isValid 
        ? 'GST number format is valid' 
        : 'Invalid GST format. Expected format: 22AAAAA0000A1Z5'
    };

    // Update the pending_approvals record
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('pending_approvals')
      .update({
        gst_validation_status: isValid ? 'valid' : 'invalid',
        gst_validation_message: validation.message
      })
      .eq('id', approvalId);

    if (updateError) {
      console.error('Error updating approval:', updateError);
      throw updateError;
    }

    console.log(`GST validation complete: ${isValid ? 'VALID' : 'INVALID'}`);

    return new Response(
      JSON.stringify(validation),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in validate-gst:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});