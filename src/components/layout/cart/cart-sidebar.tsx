import React from "react";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/context/CartContent";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart} = useCart();

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <p className="text-sm text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {cartItems.length === 0 ? (
            // Empty State
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingBag className="w-20 h-20 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Add some items to get started
              </p>
              <Link to="/products" onClick={onClose}>
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    // Resolve image path
                    const imgSrc = item.image
                      ? item.image.startsWith('http') || item.image.startsWith('/')
                        ? item.image
                        : `/assets/images/${item.image}`
                      : undefined;

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                      >
                        {/* Product Image */}
                        <Link
                          to={`/products/${item.categorySlug}/${item.productSlug}`}
                          onClick={onClose}
                          className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 hover:opacity-80 transition-opacity"
                        >
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML =
                                  '<div class="flex items-center justify-center h-full text-gray-400 text-3xl">📦</div>';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-3xl">
                              📦
                            </div>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <Link
                                to={`/products/${item.categorySlug}/${item.productSlug}`}
                                onClick={onClose}
                                className="hover:text-primary transition-colors"
                              >
                                <h3 className="font-medium text-sm line-clamp-2">
                                  {item.name}
                                </h3>
                              </Link>
                              {item.variant && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.variant}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-primary mt-1">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-xs font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={
                                  item.quantity >= (item.maxQuantity || 99)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-semibold text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer - Totals and Checkout */}
              <div className="border-t p-4 space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {shipping > 0 && subtotal < 100 && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                      💡 Add{' '}
                      <span className="font-semibold text-foreground">
                        ${(100 - subtotal).toFixed(2)}
                      </span>{' '}
                      more for free shipping
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Link to="/cart" onClick={onClose} className="block">
                    <Button className="w-full" size="lg" variant="outline">
                      View Full Cart
                    </Button>
                  </Link>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      onClose();
                      // You can add checkout functionality here
                      window.location.href = '/checkout';
                    }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="pt-2">
                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Secure checkout - Your information is protected
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;