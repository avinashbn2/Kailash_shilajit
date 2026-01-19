import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function loadEnv() {
  const envPath = join(__dirname, '.env.local')
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

console.log('Testing Supabase connection...\n')
console.log('URL:', env.NEXT_PUBLIC_SUPABASE_URL)

try {
  // Test orders table
  console.log('Testing orders table...')
  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .limit(1)

  if (error) {
    console.error('❌ Error connecting to orders table:', error)
  } else {
    console.log('✅ Successfully connected to orders table!')
    console.log('   Records found:', data?.length || 0)
  }

  // Test a simple insert to check write permissions
  console.log('\nTesting write permissions...')
  const testOrder = {
    order_id: 'test_' + Date.now(),
    amount: 100,
    currency: 'INR',
    status: 'created',
    customer_name: 'Test Customer',
    customer_email: 'test@example.com',
    customer_phone: '1234567890',
    shipping_address: 'Test Address',
    pin_code: '123456',
    items: []
  }

  const { data: insertData, error: insertError } = await supabase
    .from('orders')
    .insert(testOrder)
    .select()

  if (insertError) {
    console.error('❌ Error inserting test order:', insertError)
  } else {
    console.log('✅ Successfully inserted test order!')

    // Clean up test order
    await supabase.from('orders').delete().eq('order_id', testOrder.order_id)
    console.log('✅ Test order cleaned up')
  }

} catch (error) {
  console.error('❌ Connection test failed:', error)
}
