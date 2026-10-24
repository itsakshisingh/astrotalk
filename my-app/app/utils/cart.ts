export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  category: string;
}

const CART_STORAGE_KEY = 'jyotish_cart_items';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart_updated'));
  } catch (e) {
    console.error('Failed to save cart to localStorage:', e);
  }
}

export function addToCart(product: {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}, qty: number = 1): CartItem[] {
  const current = getCart();
  const existingIndex = current.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    current[existingIndex].quantity += qty;
  } else {
    current.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: qty,
      image: product.image,
      category: product.category || 'Energized Product',
    });
  }

  saveCart(current);
  return current;
}

export function removeFromCart(id: string): CartItem[] {
  const current = getCart().filter((item) => item.id !== id);
  saveCart(current);
  return current;
}

export function updateCartQuantity(id: string, delta: number): CartItem[] {
  const current = getCart()
    .map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean) as CartItem[];

  saveCart(current);
  return current;
}

export function getCartCount(): number {
  const current = getCart();
  return current.reduce((total, item) => total + item.quantity, 0);
}
