import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

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

console.log('🔍 Checking if payment_id column exists in orders table...\n')

try {
  // Try to select payment_id column
  const { data, error } = await supabase
    .from('orders')
    .select('payment_id')
    .limit(1)

  if (error) {
    if (error.message.includes('payment_id')) {
      console.log('❌ payment_id column does NOT exist in orders table\n')
      console.log('📋 You need to run this SQL in Supabase Dashboard:')
      console.log(`   Link: https://supabase.com/dashboard/project/${env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0]}/sql/new\n`)

      const sql = fs.readFileSync(join(__dirname, '..', 'supabase', 'migrations', '003_add_payment_id_to_orders.sql'), 'utf-8')
      console.log('='.repeat(80))
      console.log(sql)
      console.log('='.repeat(80))
      console.log('\n⚠️  Payment verification will fail until this column is added!\n')
    } else {
      console.log('❌ Unexpected error:', error)
    }
  } else {
    console.log('✅ payment_id column EXISTS in orders table')
    console.log('✅ Database is ready for payment verification!')
    console.log('\n💡 If payment is still failing, check the server logs for other errors\n')
  }
} catch (error) {
  console.error('❌ Error checking database:', error)
}
