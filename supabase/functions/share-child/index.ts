import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { childId, email } = await req.json()

    // Get user by email using admin API
    const { data: { users }, error: listError } = await supabaseClient.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    const targetUser = users?.find(u => u.email === email)

    if (!targetUser) {
      return new Response(
        JSON.stringify({ error: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Check if user owns the child
    const { data: child, error: childError } = await supabaseClient
      .from('children')
      .select('user_id')
      .eq('id', childId)
      .single()

    if (childError || child.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Bu çocuğu paylaşma yetkiniz yok' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Check if already shared
    const { data: existing } = await supabaseClient
      .from('child_shares')
      .select('id')
      .eq('child_id', childId)
      .eq('shared_with_user_id', targetUser.id)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Bu çocuk zaten bu kullanıcı ile paylaşılmış' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Create share
    const { error: shareError } = await supabaseClient
      .from('child_shares')
      .insert({
        child_id: childId,
        shared_with_user_id: targetUser.id,
        created_by: user.id
      })

    if (shareError) {
      throw shareError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
