import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
export default function HomePage() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$89",
      image: "/images/headphones.jpg",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "$129",
      image: "/images/watch.jpg",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Gaming Mouse",
      price: "$59",
      image: "/images/mouse.jpg",
      rating: 4.3,
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      price: "$99",
      image: "/images/keyboard.jpg",
      rating: 4.7,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Upgrade Your Style with{" "}
              <span className="text-primary">Tech Essentials</span>
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Discover top-quality gadgets and accessories designed to make your
              everyday life smarter, faster, and more stylish.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button size="lg">Shop Now</Button>
              <Button size="lg" variant="outline">
                View Deals
              </Button>
            </div>
          </div>
          <img
            src="/images/hero-banner.png"
            alt="Hero Banner"
            className="w-full md:w-1/2 rounded-xl mt-10 md:mt-0"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-all cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover rounded-t-xl"
              />
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-primary font-medium">{product.price}</p>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-500"
                          : "fill-none"
                      }`}
                    />
                  ))}
                </div>
                <Button className="w-full mt-3">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <section className="bg-primary text-primary-foreground text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">Exclusive Winter Sale</h2>
        <p className="max-w-xl mx-auto mb-8">
          Get up to <span className="font-bold text-xl">50% OFF</span> on select
          products. Limited time only!
        </p>
        <Button variant="secondary" size="lg">
          Shop the Sale
        </Button>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/30 text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to get updates on new arrivals and special offers.
        </p>
        <form className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
