import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

// Load environment variables
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
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

console.log('🚀 Auto-setup for Supabase database\n')

// Check for orders table (which should have the trigger function)
const { error: ordersError } = await supabase.from('orders').select('id').limit(1)

if (ordersError) {
  console.log('⚠️  Orders table not found. Running migration 001 first...\n')
  console.log('📋 Please run this SQL in Supabase Dashboard:')
  console.log('   Link: https://supabase.com/dashboard/project/eygrzvfnxbjdqpfypojb/sql/new\n')

  const sql001 = fs.readFileSync(join(__dirname, '..', 'supabase', 'migrations', '001_create_orders_table.sql'), 'utf-8')
  console.log('='.repeat(80))
  console.log(sql001)
  console.log('='.repeat(80))
  console.log('\n✅ After running the above, run this script again.\n')
  process.exit(0)
}

console.log('✅ Orders table exists!\n')

// Now check products table
const { error: productsError } = await supabase.from('products').select('id').limit(1)

if (productsError) {
  console.log('⚠️  Products table not found. Creating now...\n')
  console.log('📋 Please run this SQL in Supabase Dashboard:')
  console.log('   Link: https://supabase.com/dashboard/project/eygrzvfnxbjdqpfypojb/sql/new\n')

  const sql002 = fs.readFileSync(join(__dirname, '..', 'supabase', 'migrations', '002_create_products_table.sql'), 'utf-8')
  console.log('='.repeat(80))
  console.log(sql002)
  console.log('='.repeat(80))
  console.log('\n✅ After running the above, run: npm run db:seed\n')
  process.exit(0)
}

console.log('✅ Products table exists!')
console.log('✅ Database is ready!')
console.log('\n💡 Run "npm run db:seed" to populate products\n')
