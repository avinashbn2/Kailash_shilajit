import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

// Load environment variables manually
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function loadEnv() {
  const envPath = join(__dirname, '..', '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const env = {}

  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })

  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

// SQL to create products table
const createProductsTableSQL = `
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  price INTEGER NOT NULL,
  mrp INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  sizes TEXT[] NOT NULL,
  current_size TEXT NOT NULL,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  question_count INTEGER NOT NULL DEFAULT 0,
  answer_count INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  what_is_it TEXT,
  what_does_it_do TEXT[],
  our_promise TEXT,
  usage TEXT[],
  what_makes_it_special TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
`

const createIndexSQL = `
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
`

const enableRLSSQL = `
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
`

const createReadPolicySQL = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can read products'
  ) THEN
    CREATE POLICY "Anyone can read products"
      ON public.products
      FOR SELECT
      USING (true);
  END IF;
END $$;
`

const createServiceRolePolicySQL = `
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Service role can do everything'
  ) THEN
    CREATE POLICY "Service role can do everything"
      ON public.products
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
`

async function executeSQLfunction(sql, description) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      // If rpc doesn't work, try direct query via PostgREST
      // This is a fallback - we'll use postgres connection string if available
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }

    console.log(`✅ ${description}`)
    return true
  } catch (error) {
    console.log(`⚠️  Could not execute via API: ${error.message}`)
    return false
  }
}

async function createTablesViaAPI() {
  console.log('🔧 Attempting to create tables via Supabase API...\n')

  const queries = [
    { sql: createProductsTableSQL, desc: 'Created products table' },
    { sql: createIndexSQL, desc: 'Created index' },
    { sql: enableRLSSQL, desc: 'Enabled RLS' },
    { sql: createReadPolicySQL, desc: 'Created read policy' },
    { sql: createServiceRolePolicySQL, desc: 'Created service role policy' }
  ]

  for (const { sql, desc } of queries) {
    await executeSQL(sql, desc)
  }
}

async function createTables() {
  console.log('🚀 Creating database tables...\n')

  // Try API method first
  await createTablesViaAPI()

  console.log('\n📝 If the above didn\'t work, please run the SQL manually:')
  console.log(`   1. Go to: https://supabase.com/dashboard/project/${supabaseUrl.split('//')[1].split('.')[0]}/sql/new`)
  console.log('   2. Copy the SQL from: supabase/migrations/002_create_products_table.sql')
  console.log('   3. Paste and click "Run"')
  console.log('   4. Then run: npm run db:seed\n')
}

createTables().catch(console.error)
