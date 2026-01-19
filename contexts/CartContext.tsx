'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Cart, CartItem } from '@/types'

interface CartContextType {
  cart: Cart
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number, openCart?: boolean) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'kailash_cart'

const calculateCartTotals = (items: CartItem[]): Cart => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    items,
    totalItems,
    subtotal,
    total: subtotal // Add shipping logic here if needed
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount (disabled - cart starts empty)
  useEffect(() => {
    // Uncomment below to persist cart across page reloads
    // const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    // if (storedCart) {
    //   try {
    //     const parsedCart = JSON.parse(storedCart)
    //     setCart(calculateCartTotals(parsedCart.items || []))
    //   } catch (error) {
    //     console.error('Failed to parse cart from localStorage:', error)
    //   }
    // }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, isHydrated])

  const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity = 1, openCart = true) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.productId === newItem.productId && item.size === newItem.size
      )

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = [...prevCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        }
      } else {
        // Add new item
        const cartItem: CartItem = {
          ...newItem,
          id: `${newItem.productId}_${newItem.size}`,
          quantity
        }
        updatedItems = [...prevCart.items, cartItem]
      }

      return calculateCartTotals(updatedItems)
    })

    // Open cart drawer when item is added (only if openCart is true)
    if (openCart) {
      setIsCartOpen(true)
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId)
      return calculateCartTotals(updatedItems)
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId)
      return
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      return calculateCartTotals(updatedItems)
    })
  }

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      subtotal: 0,
      total: 0
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
