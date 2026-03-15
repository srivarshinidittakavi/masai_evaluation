import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl); 
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);


const testConnection = async () => {
  const { data, error } = await supabase.from('users').select('count').limit(1);
  if (error) {
    console.error('Supabase connection error:', error.message);
  } else {
    console.log('Supabase connected successfully');
  }
};

testConnection();

export default supabase;