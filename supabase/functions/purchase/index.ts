import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Stripe } from "./deps.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PURCHASE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Purchase function started");
    
    const { quantity } = await req.json();
    
    if (!quantity || quantity < 1 || quantity > 10000) {
      return new Response(JSON.stringify({ 
        error: "Quantidade deve ser entre 1 e 10000 números"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create Supabase client for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: "Usuário não autenticado" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      logStep("Authentication error", { error: userError?.message });
      return new Response(JSON.stringify({ 
        error: "Usuário não autenticado" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    // Calculate price based on new rule (in cents)
    const calculatePrice = (qty: number) => {
      if (qty >= 1000) {
        return qty * 5; // R$ 0,05 = 5 centavos
      }
      return qty * 10; // R$ 0,10 = 10 centavos
    };
    const totalAmount = calculatePrice(quantity);

    // Get user info from metadata
    const userName = user.user_metadata?.full_name || 'Usuário';
    const userPhone = user.user_metadata?.phone || '';

    // Create Supabase service client for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Store purchase record in database before creating Stripe session
    // Raffle numbers will be generated and associated after payment confirmation via webhook
    const { data: purchaseRecord, error: insertError } = await supabaseService
      .from('raffle_purchases')
      .insert({
        user_id: user.id,
        user_name: userName,
        user_phone: userPhone,
        quantity,
        amount: totalAmount,
        status: 'pendente',
        raffle_numbers: null, // Numbers will be generated after payment confirmation
      })
      .select()
      .single();

    if (insertError) {
      logStep("Error storing purchase", { error: insertError.message });
      return new Response(JSON.stringify({
        error: "Erro ao registrar compra"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    logStep("Purchase stored successfully", { purchaseId: purchaseRecord.id });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Números - Porsche Taycan (${quantity} números)`,
              description: `Compra de ${quantity} números para o sorteio do Porsche Taycan.`,
            },
            unit_amount: Math.round(totalAmount / quantity), // unit_amount expects an integer in cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/minhas-numeros?success=true`,
      cancel_url: `${req.headers.get("origin")}/comprar-numeros?canceled=true`,
      metadata: {
        user_id: user.id,
        purchase_id: purchaseRecord.id,
      },
    });

    logStep("Stripe session created", { sessionId: session.id });

    // Update purchase record with Stripe session ID
    const { error: updateError } = await supabaseService
      .from('raffle_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchaseRecord.id);

    if (updateError) {
      logStep("Error updating purchase with Stripe session ID", { error: updateError.message });
      // Non-critical error, proceed with checkout
    }

    logStep("Purchase stored successfully");

    return new Response(JSON.stringify({
      success: true,
      url: session.url,
      quantity,
      total_amount: totalAmount / 100, // Convert back to reais
      message: `Compra criada! Você será redirecionado para o pagamento.`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    logStep("Unexpected error", { error: error.message });
    return new Response(JSON.stringify({ 
      error: "Erro interno do servidor" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});