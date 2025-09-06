import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REGISTER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Register function started");
    
    const { name, phone, password } = await req.json();
    
    // Validation
    if (!name || name.trim().length < 3) {
      return new Response(JSON.stringify({ 
        error: "Nome deve ter pelo menos 3 caracteres" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!phone || phone.trim().length < 10) {
      return new Response(JSON.stringify({ 
        error: "Telefone deve ser válido" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!password || password.length < 6) {
      return new Response(JSON.stringify({ 
        error: "Senha deve ter no mínimo 6 caracteres" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Generate email from phone for authentication
    const email = `${phone.replace(/\D/g, '')}@phone.local`;
    
    logStep("Creating user", { email, name, phone });

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: name,
        phone: phone,
      }
    });

    if (error) {
      logStep("Registration error", { error: error.message });
      return new Response(JSON.stringify({ 
        error: error.message.includes('already') ? 
          "Usuário já cadastrado" : 
          "Erro ao criar conta" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("User created successfully", { userId: data.user.id });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Conta criada com sucesso!" 
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