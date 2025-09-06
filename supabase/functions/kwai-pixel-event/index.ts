import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EventProperties {
  content_id: string;
  content_type: string;
  content_name: string;
}

interface KwaiEventData {
  access_token: string;
  clickid: string;
  event_name: string;
  is_attributed: number;
  mmpcode: string;
  pixelId: string;
  pixelSdkVersion: string;
  properties: EventProperties;
  testFlag: boolean;
  third_party: string;
  trackFlag: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const eventData: KwaiEventData = await req.json();

    const accessToken = Deno.env.get("KWAI_ACCESS_TOKEN");
    if (!accessToken) {
      console.error("KWAI_ACCESS_TOKEN is not set");
      return new Response(JSON.stringify({ error: "KWAI_ACCESS_TOKEN is not set" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const url = "https://www.adsnebula.com/log/common/api";
    const body = JSON.stringify({
      ...eventData,
      access_token: accessToken,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json;charset=utf-8",
      },
      body,
    });

    if (!response.ok) {
      console.error("Kwai API error:", response.status, response.statusText, await response.text());
      return new Response(JSON.stringify({ error: "Kwai API error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.status,
      });
    }

    const result = await response.json();
    console.log("Kwai API result:", result);

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});