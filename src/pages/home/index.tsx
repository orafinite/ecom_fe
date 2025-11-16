"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, ChevronRight, Package } from "lucide-react";

/**
 * HomePage — loads public/productscatalog.json with categories structure
 * Place productscatalog.json at: public/productscatalog.json
 * Place images at: public/assets/images/<filename>
 */

type ProductRaw = {
  title: string;
  description?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
  price?: string;
  specs?: Record<string, any>;
  features?: string[];
};

type CategoryRaw = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: ProductRaw[];
};

type CatalogData = {
  categories: CategoryRaw[];
};

type Product = {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  images: string[];
  price?: string;
  specs?: Record<string, any>;
  features?: string[];
  category: string;
  categorySlug: string;
};

type Category = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
};

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // lightbox state
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetch("/productscatalog.json")
      .then((res) => res.json())
      .then((data: CatalogData) => {
        if (!mounted) return;

        const allProducts: Product[] = [];
        const categoryList: Category[] = [];

        data.categories.forEach((cat) => {
          categoryList.push({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image ? `/assets/images/${cat.image}` : undefined,
            productCount: cat.products.length,
          });

          cat.products.forEach((p, idx) => {
            const img =
              p.image && p.image.trim() !== ""
                ? `/assets/images/${p.image}`
                : "/assets/images/placeholder.png";
            const images = [img];

            allProducts.push({
              id: `${cat.slug}-${idx}`,
              name: p.title,
              description: p.description,
              badge: p.badge,
              ctaText: p.ctaText,
              ctaLink: p.ctaLink,
              images,
              price: p.price,
              specs: p.specs,
              features: p.features,
              category: cat.name,
              categorySlug: cat.slug,
            });
          });
        });

        setProducts(allProducts);
        setCategories(categoryList);
      })
      .catch((err) => {
        console.error("Failed to load productscatalog.json", err);
        setProducts([]);
        setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  }

  function openLightbox(images: string[], index = 0) {
    setLightboxImages(images);
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    setLightboxImages(null);
    setLightboxIndex(0);
    document.body.style.overflow = "";
  }

  // Get featured products (first 8 products or products with badge)
  const featuredProducts = products
    ? products
        .filter((p) => p.badge)
        .slice(0, 8)
        .concat(products.filter((p) => !p.badge))
        .slice(0, 8)
    : [];

  // Filter products by category
  const displayProducts = selectedCategory
    ? products?.filter((p) => p.categorySlug === selectedCategory) || []
    : featuredProducts;

  const sliderSlides =
    categories?.slice(0, 5).map((cat) => ({
      src: cat.image || "/assets/images/placeholder.png",
      alt: cat.name,
      caption: cat.description || cat.name,
    })) || [];

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="relative py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Package className="h-4 w-4" />
                  New Arrivals Available
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Upgrade Your Life with{" "}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Premium Tech
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto md:mx-0">
                Discover top-quality gadgets and accessories designed to make
                everyday life smarter, faster, and more stylish — handpicked for
                performance and design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="shadow-lg transform-gpu hover:-translate-y-0.5 transition-all hover:shadow-xl"
                >
                  Shop Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5"
                >
                  View Deals
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 7h-9M14 17H5M18 12H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Free Shipping</div>
                    <div className="text-xs text-muted-foreground">
                      Orders over NRs. 6,500
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5M12 7v5l4 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">30-Day Returns</div>
                    <div className="text-xs text-muted-foreground">
                      Hassle-free guarantee
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              {products === null ? (
                <div className="rounded-2xl overflow-hidden shadow-2xl h-72 md:h-96 bg-muted/10 animate-pulse" />
              ) : (
                <HeroSlider slides={sliderSlides} interval={4500} />
              )}
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Shop by Category</h2>
            </div>
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`flex-shrink-0 snap-start px-6 py-3 rounded-full font-medium transition-all ${
                    selectedCategory === null
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex-shrink-0 snap-start px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat.slug
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {cat.name}
                    <span className="ml-2 text-xs opacity-70">
                      ({cat.productCount})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {selectedCategory
                  ? categories?.find((c) => c.slug === selectedCategory)?.name
                  : "Featured Products"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedCategory
                  ? categories?.find((c) => c.slug === selectedCategory)
                      ?.description
                  : "Curated picks based on quality and value"}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {displayProducts.length} products
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products === null
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 rounded-xl bg-muted/10 animate-pulse"
                  />
                ))
              : displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenLightbox={openLightbox}
                  />
                ))}
          </div>

          {displayProducts.length === 0 && products !== null && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </section>

        {/* Promo */}
        <section className="py-16">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/95 via-primary/85 to-primary/75 text-primary-foreground p-10 md:p-16 shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Exclusive Winter Sale
              </h2>
              <p className="mb-8 text-primary-foreground/90 text-lg">
                Get up to <span className="font-bold text-2xl">50% OFF</span> on
                select products. Limited time only!
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="shadow-xl hover:shadow-2xl transform-gpu hover:-translate-y-0.5 transition-all"
              >
                Shop the Sale
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-muted/30 to-muted/10 border border-muted/50 rounded-2xl p-8 md:p-12 text-center backdrop-blur-sm">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              Stay in the Loop
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Subscribe to get updates on new arrivals, exclusive offers, and
              tech insights.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="max-w-md mx-auto flex gap-3"
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background shadow-sm"
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              <Button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="shadow-lg"
              >
                Subscribe
              </Button>
            </form>

            {error && (
              <p id="email-error" className="mt-4 text-sm text-destructive">
                {error}
              </p>
            )}
            {subscribed && (
              <div className="mt-5 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-3 rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Thanks! You're subscribed.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onChangeIndex={(i) => setLightboxIndex(i)}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ProductCard                                                                */
/* -------------------------------------------------------------------------- */
function ProductCard({
  product,
  onOpenLightbox,
}: {
  product: Product;
  onOpenLightbox: (images: string[], index?: number) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform-gpu hover:-translate-y-1 cursor-pointer overflow-hidden border-muted/40">
      <div className="relative">
        <div className="w-full h-64 bg-gradient-to-br from-muted/5 to-muted/20 flex items-center justify-center overflow-hidden">
          <img
            src={product.images[active] ?? product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={() => onOpenLightbox(product.images, active)}
            style={{ cursor: "zoom-in" }}
          />
          {product.badge && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {product.badge}
            </div>
          )}
        </div>

        {product.images.length > 1 && (
          <div className="absolute left-3 right-3 bottom-3 flex gap-2 justify-center">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                aria-label={`View photo ${i + 1} of ${product.name}`}
                className={`h-10 w-16 rounded-md overflow-hidden border-2 transition-all ${
                  i === active
                    ? "border-primary shadow-lg scale-105"
                    : "border-white/50 hover:border-white"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 flex-1">
              {product.name}
            </h3>
            {product.price && (
              <div className="text-primary font-bold text-xl whitespace-nowrap">
                {product.price}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.features.slice(0, 2).map((feature, i) => (
                <span
                  key={i}
                  className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-muted/30">
          <div className="flex items-center gap-1" aria-label="Rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-none text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
          </div>

          <Button
            size="sm"
            className="ml-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* HeroSlider                                                                 */
/* -------------------------------------------------------------------------- */
function HeroSlider({
  slides,
  interval = 4000,
}: {
  slides: { src: string; alt?: string; caption?: string }[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!paused && slides.length > 0) {
      timerRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
      }, interval);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, interval, slides.length]);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
      touchStartX.current = null;
    }
  }

  if (!slides.length) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-2xl h-72 md:h-96 bg-muted/10" />
    );
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-muted/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Promotional slides"
    >
      <div className="relative h-64 md:h-80 lg:h-96">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <figure
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                active
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!active}
            >
              <img
                src={s.src}
                alt={s.alt ?? ""}
                className="w-full h-full object-cover"
                draggable={false}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {s.caption && (
                <figcaption className="absolute left-6 bottom-6 right-6 bg-gradient-to-r from-black/70 to-black/50 backdrop-blur-sm text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-xl">
                  {s.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-muted-foreground rounded-full p-3 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary z-20 transition-all"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 18l-6-6 6-6"
          />
        </svg>
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-muted-foreground rounded-full p-3 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary z-20 transition-all"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ImageLightbox                                                              */
/* -------------------------------------------------------------------------- */
function ImageLightbox({
  images,
  index,
  onClose,
  onChangeIndex,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
}) {
  const idxRef = useRef(index);
  useEffect(() => {
    idxRef.current = index;
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowLeft")
        onChangeIndex((idxRef.current - 1 + images.length) % images.length);
      if (e.key === "ArrowRight")
        onChangeIndex((idxRef.current + 1) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose, onChangeIndex]);

  function prev() {
    onChangeIndex((index - 1 + images.length) % images.length);
  }
  function next() {
    onChangeIndex((index + 1) % images.length);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-w-5xl w-full rounded-xl overflow-hidden bg-transparent shadow-2xl">
        <img
          src={images[index]}
          alt={`Image ${index + 1}`}
          className="w-full h-[70vh] object-contain bg-black/50 rounded-xl"
        />
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 18l-6-6 6-6"
            />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6l6 6-6 6"
            />
          </svg>
        </button>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 bg-white/95 hover:bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-3 bg-black/70 backdrop-blur-md rounded-xl shadow-xl">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onChangeIndex(i)}
                className={`h-14 w-20 rounded-lg overflow-hidden border-2 transition-all ${
                  i === index
                    ? "border-primary shadow-lg scale-110"
                    : "border-white/30 hover:border-white/60"
                }`}
              >
                <img
                  src={img}
                  alt={`thumb ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
