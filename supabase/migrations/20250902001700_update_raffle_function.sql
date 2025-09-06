-- Update function to generate random raffle numbers, excluding pending ones
CREATE OR REPLACE FUNCTION public.generate_raffle_numbers(quantity integer)
 RETURNS integer[]
 LANGUAGE plpgsql
AS $function$
DECLARE
    numbers INTEGER[] := '{}';
    available_numbers INTEGER[];
BEGIN
    -- Optimization: Generate a list of available numbers and shuffle them
    -- Excludes numbers from confirmed or pending purchases to avoid duplication
    SELECT ARRAY(
        SELECT generate_series(1, 1000000) 
        EXCEPT 
        SELECT unnest(raffle_numbers) 
        FROM public.raffle_purchases 
        WHERE status IN ('confirmado', 'pendente')
    ) INTO available_numbers;
    
    -- Shuffle the array and take the required quantity
    SELECT array_agg(n) INTO numbers FROM (
        SELECT n FROM unnest(available_numbers) AS n
        ORDER BY random()
        LIMIT quantity
    ) AS shuffled;

    RETURN numbers;
END;
$function$;