import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, description, creatorId, chatId, metadata } = await req.json()

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get creator's Stripe Connect account ID
    const { data: creator, error: creatorError } = await supabaseClient
      .from('creators')
      .select('stripe_account_id, username')
      .eq('id', creatorId)
      .single()

    if (creatorError || !creator?.stripe_account_id) {
      throw new Error('Creator not found or Stripe account not connected')
    }

    // Create payment intent with automatic transfer to creator
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
      metadata,
      transfer_data: {
        destination: creator.stripe_account_id,
        amount: Math.floor(amount * 0.85), // Creator gets 85%, platform keeps 15%
      },
    })

    // Log the transaction in Supabase
    await supabaseClient.from('transactions').insert({
      chat_id: chatId,
      creator_id: creatorId,
      amount: amount / 100, // Convert back to dollars
      type: 'media_purchase',
      stripe_payment_intent_id: paymentIntent.id,
      status: 'pending'
    })

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment creation failed:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})