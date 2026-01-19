import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Transform snake_case database fields to camelCase for frontend
    const transformedOrder = {
      id: order.id,
      orderId: order.order_id,
      paymentId: order.payment_id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentMethod: order.payment_method, // NEW - 'online' or 'cod'
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      pinCode: order.pin_code,
      items: order.items,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    }

    return NextResponse.json(transformedOrder)

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
