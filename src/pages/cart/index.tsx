import React from "react";
import {  Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  maxQuantity?: number;
}

export default function CartPage() {
  // Sample cart data - replace with your actual cart state
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: "1",
      name: "Wireless Headphones",
      price: 89.99,
      quantity: 1,
      image: "/images/headphones.jpg",
      variant: "Black Edition",
      maxQuantity: 10,
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 129.99,
      quantity: 2,
      image: "/images/watch.jpg",
      variant: "Silver",
      maxQuantity: 5,
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 129.99,
      quantity: 2,
      image: "/images/watch.jpg",
      variant: "Silver",
      maxQuantity: 5,
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(newQuantity, item.maxQuantity || 99)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 via-background to-background py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex-1">
        {cartItems.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="w-32 h-32 text-muted-foreground/40 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button size="lg">
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-bold mb-6">Cart Items</h2>
              {cartItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-6 h-30">
                      {/* Product Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {item.name}
                              </h3>
                              {item.variant && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Variant: {item.variant}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                          <p className="text-primary font-semibold text-xl mt-2">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= (item.maxQuantity || 99)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-bold text-xl">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Continue Shopping Button */}
              <Button variant="outline" size="lg" className="mt-6">
                <a href="/">← Continue Shopping</a>
              </Button>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <Card className=" top-6 sticky mt-14">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-semibold">
                            Free
                          </span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {shipping > 0 && subtotal < 100 && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        💡 Add <span className="font-semibold text-foreground">${(100 - subtotal).toFixed(2)}</span> more for free
                        shipping
                      </div>
                    )}

                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>

                    {/* Checkout Buttons */}
                    <div className="space-y-3 pt-6">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Apply Coupon Code
                      </Button>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-xs text-center text-muted-foreground">
                        🔒 Secure checkout - Your information is protected
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>

      {/* Promo Section */}
      <section className="bg-primary text-primary-foreground text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
        <p className="max-w-xl mx-auto mb-8">
          Have questions about your order? Our customer service team is here to
          help you 24/7.
        </p>
        <Button variant="secondary" size="lg">
          Contact Support
        </Button>
      </section>
    </div>
  );
}