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
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL

console.log('🔧 Migration 003: Add payment_id to orders table\n')

const sql = fs.readFileSync(join(__dirname, '..', 'supabase', 'migrations', '003_add_payment_id_to_orders.sql'), 'utf-8')

console.log('📋 Please run this SQL in Supabase Dashboard:')
console.log(`   Link: https://supabase.com/dashboard/project/${supabaseUrl.split('//')[1].split('.')[0]}/sql/new\n`)

console.log('='.repeat(80))
console.log(sql)
console.log('='.repeat(80))

console.log('\n✅ After running the SQL above, your payment verification will work!\n')
