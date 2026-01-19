# Database Setup Instructions

The SQL for creating the products table has been copied to your clipboard!

## Quick Setup (2 minutes)

### Step 1: Open Supabase SQL Editor
The browser should have opened automatically to:
https://supabase.com/dashboard/project/eygrzvfnxbjdqpfypojb/sql/new

If not, click the link above.

### Step 2: Paste and Run SQL
1. In the SQL Editor, paste the SQL (it's already in your clipboard - just Cmd+V / Ctrl+V)
2. Click the **"Run"** button (or press Cmd+Enter)
3. You should see "Success. No rows returned"

### Step 3: Verify
Run this command to verify the setup:
```bash
npm run db:auto-setup
```

You should see: "✅ Products table exists!"

### Step 4: Seed Products (Optional)
The SQL already includes sample products, but you can re-run the seed if needed:
```bash
npm run db:seed
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 and you should see products loading from Supabase!

## Troubleshooting

If you see errors:
1. Make sure you're logged into the correct Supabase project
2. Check that Row Level Security policies are created
3. Verify your .env.local has the correct credentials

## What Was Created

- **products table**: Stores all product information (name, price, images, descriptions, etc.)
- **RLS policies**: Public read access, service role full access
- **Indexes**: For faster product queries
- **Sample data**: 4 products pre-populated

## Features Implemented

1. **Database Integration**: Products now load from Supabase instead of hardcoded data
2. **Separate Buttons**:
   - "Add to Bag" - Adds to cart, opens cart drawer
   - "Buy Now" - Adds to cart, redirects to checkout
3. **API Routes**: `/api/products` and `/api/products/[id]` for fetching data
4. **Loading States**: Skeleton loaders while data is being fetched
5. **Fallback**: If Supabase is unavailable, falls back to hardcoded products
