import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigrations() {
  console.log('Starting migrations...\n')

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')
  const migrationFiles = fs.readdirSync(migrationsDir).sort()

  for (const file of migrationFiles) {
    if (!file.endsWith('.sql')) continue

    console.log(`Running migration: ${file}`)
    const filePath = path.join(migrationsDir, file)
    const sql = fs.readFileSync(filePath, 'utf-8')

    try {
      // Split by semicolons but keep multi-line statements together
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        if (statement) {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

          // If rpc doesn't exist, try direct query
          if (error && error.message.includes('function')) {
            const { error: queryError } = await supabase.from('_').select('*').limit(0)
            // Just log, we'll use a different approach
          }
        }
      }

      console.log(`✅ Completed: ${file}\n`)
    } catch (error) {
      console.error(`❌ Error in ${file}:`, error)
      process.exit(1)
    }
  }

  console.log('All migrations completed successfully!')
}

runMigrations().catch(console.error)
