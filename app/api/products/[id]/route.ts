import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform snake_case to camelCase for consistency with existing code
    const transformedProduct = {
      id: product.id,
      name: product.name,
      shortDescription: product.short_description,
      price: product.price,
      mrp: product.mrp,
      images: product.images,
      sizes: product.sizes,
      currentSize: product.current_size,
      sizeVariants: product.size_variants, // NEW - different prices per size
      rating: product.rating,
      reviewCount: product.review_count,
      questionCount: product.question_count,
      answerCount: product.answer_count,
      inStock: product.in_stock,
      whatIsIt: product.what_is_it,
      whatDoesItDo: product.what_does_it_do,
      ourPromise: product.our_promise,
      usage: product.usage,
      whatMakesItSpecial: product.what_makes_it_special,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
