import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Stripe, createClient } from "./deps.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE_WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Stripe webhook function started");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      );
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Webhook event received", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { purchase_id, user_id } = session.metadata || {};

      if (!purchase_id || !user_id) {
        logStep("Missing metadata in checkout session", { sessionId: session.id, metadata: session.metadata });
        return new Response(JSON.stringify({ error: "Missing metadata" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      logStep("Checkout session completed", { sessionId: session.id, purchaseId: purchase_id, userId: user_id });

      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      // Fetch the purchase record to get the quantity
      const { data: purchaseRecord, error: fetchError } = await supabaseService
        .from('raffle_purchases')
        .select('quantity')
        .eq('id', purchase_id)
        .single();

      if (fetchError || !purchaseRecord) {
        logStep("Error fetching purchase record or record not found", { purchaseId: purchase_id, error: fetchError?.message });
        return new Response(JSON.stringify({ error: "Purchase record not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      const quantity = purchaseRecord.quantity;
      logStep("Fetched quantity for purchase", { purchaseId: purchase_id, quantity });

      // Generate raffle numbers
      const { data: raffleNumbers, error: numbersError } = await supabaseService
        .rpc('generate_raffle_numbers', { quantity });

      if (numbersError) {
        logStep("Error generating raffle numbers", { error: numbersError.message });
        return new Response(JSON.stringify({ error: "Error generating raffle numbers" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      logStep("Generated raffle numbers for purchase", { purchaseId: purchase_id, numbers: raffleNumbers });

      // Update the purchase record with raffle numbers and confirmed status
      const { error: updateError } = await supabaseService
        .from('raffle_purchases')
        .update({ raffle_numbers: raffleNumbers, status: 'confirmado' })
        .eq('id', purchase_id);

      if (updateError) {
        logStep("Error updating purchase record", { purchaseId: purchase_id, error: updateError.message });
        return new Response(JSON.stringify({ error: "Error updating purchase record" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      logStep("Purchase record updated successfully", { purchaseId: purchase_id, status: 'confirmado' });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("Unexpected error in webhook", { error: error.message });
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});