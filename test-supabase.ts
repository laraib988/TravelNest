import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    console.log('Attempting to create table using Supabase REST API (PostgREST)...');
    
    // Attempting to execute raw SQL via PostgREST is not natively supported without RPC.
    // Let's try to query a non-existent table to show the error, or try to call a nonexistent RPC.
    
    const { data, error } = await supabase.rpc('execute_sql', { sql: 'CREATE TABLE IF NOT EXISTS test_table (id INT);' });
    
    if (error) {
        console.error('ERROR:', error.message);
        console.error('Details:', error.details || error.hint);
        console.log('\nConclusion: As explained, the Service Role Key cannot execute raw SQL (CREATE TABLE). A Database Connection String (postgresql://...) is required.');
    } else {
        console.log('Success:', data);
    }
}

run();
