-- Create raffle purchases table
CREATE TABLE public.raffle_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  raffle_numbers INTEGER[] NOT NULL,
  quantity INTEGER NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'brl',
  status TEXT DEFAULT 'pendente', -- pendente, confirmado, falhou
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.raffle_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own purchases" 
ON public.raffle_purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can insert purchases" 
ON public.raffle_purchases 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Edge functions can update purchases" 
ON public.raffle_purchases 
FOR UPDATE 
USING (true);

-- Create function to generate random raffle numbers
CREATE OR REPLACE FUNCTION generate_raffle_numbers(quantity INTEGER)
RETURNS INTEGER[]
LANGUAGE plpgsql
AS $$
DECLARE
    numbers INTEGER[] := '{}';
    available_numbers INTEGER[];
BEGIN
    -- Otimização: Gerar uma lista de números disponíveis e embaralhar
    SELECT ARRAY(SELECT generate_series(1, 1000000) EXCEPT SELECT unnest(raffle_numbers) FROM public.raffle_purchases WHERE status = 'paid') INTO available_numbers;
    
    -- Embaralhar o array e pegar a quantidade necessária
    SELECT array_agg(n) INTO numbers FROM (
        SELECT n FROM unnest(available_numbers) AS n
        ORDER BY random()
        LIMIT quantity
    ) AS shuffled;

    RETURN numbers;
END;
$$;