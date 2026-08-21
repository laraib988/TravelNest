import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const { id } = params;
    
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
