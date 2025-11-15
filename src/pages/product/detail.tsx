import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContent';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const slugify = (s?: string, index = 0) =>
  s
    ? s
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : String(index);

interface ProductItem {
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  image?: string;
  price?: string;
  specs?: Record<string, any>;
  features?: string[];
  compatibility?: string[];
}

interface Category {
  name: string;
  slug: string;
  products: ProductItem[];
}

interface CatalogData {
  categories: Category[];
}

export default function ProductDetail() {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart, cartItems } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    fetch('/productscatalog.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch productscatalog.json');
        return r.json();
      })
      .then((data: CatalogData) => {
        const foundCategory = data.categories.find((cat) => cat.slug === categorySlug);
        if (foundCategory) {
          const foundProduct = foundCategory.products.find(
            (p, i) => slugify(p.title, i) === productSlug
          );
          if (mounted) {
            setCategory(foundCategory);
            setProduct(foundProduct ?? null);
          }
        } else {
          if (mounted) {
            setProduct(null);
            setCategory(null);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading product detail:', err);
        if (mounted) setProduct(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categorySlug, productSlug]);

  // Extract price as number
  const getPriceNumber = (priceString?: string): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/[^0-9.]/g, ''));
  };

  const handleAddToCart = () => {
    if (!product || !category) return;

    const productId = `${categorySlug}-${productSlug}`;
    const priceNumber = getPriceNumber(product.price);

    addToCart(
      {
        id: productId,
        name: product.title,
        price: priceNumber,
        image: product.image || '',
        variant: product.badge,
        maxQuantity: 10,
        categorySlug,
        productSlug,
      },
      quantity
    );

    // Show success animation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);

    // Show toast notification
    toast({
      title: 'Added to cart!',
      description: `${quantity} × ${product.title} added to your cart.`,
      duration: 3000,
    });
  };

  const isInCart = () => {
    const productId = `${categorySlug}-${productSlug}`;
    return cartItems.some((item) => item.id === productId);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500 text-lg">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product || !category) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Product not found</h2>
          <p className="mb-6 text-gray-600">
            We couldn't find the product you're looking for.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/products">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const imgSrc = product.image
    ? product.image.startsWith('http') || product.image.startsWith('/')
      ? product.image
      : new URL(`../../assets/images/${product.image}`, import.meta.url).href
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-600 mb-8 flex items-center gap-2">
          <Link to="/products" className="hover:text-blue-600 transition-colors">
            All Categories
          </Link>
          <span className="text-gray-400">/</span>
          <Link to={`/products/${categorySlug}`} className="hover:text-blue-600 transition-colors">
            {category.name}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl aspect-square flex items-center justify-center relative group">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="text-8xl mb-4 opacity-30">📦</div>
                    <span className="text-lg font-medium">No image available</span>
                  </div>
                )}
                {product.badge && (
                  <Badge className="absolute top-6 left-6 text-sm px-4 py-2 shadow-lg" variant="default">
                    {product.badge}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              {product.price && (
                <div className="text-4xl font-bold text-blue-600 mb-6">{product.price}</div>
              )}
              {product.description && (
                <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
              )}
            </div>

            {/* Quantity Selector */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-2 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="w-16 text-center font-bold text-xl">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">Max: 10 per order</span>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <Button
                size="lg"
                className={`text-lg px-8 py-6 transition-all ${
                  addedToCart ? 'bg-green-600 hover:bg-green-700' : ''
                }`}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>

              {isInCart() && (
                <Link to="/cart" className="w-full">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6 w-full">
                    View Cart & Checkout →
                  </Button>
                </Link>
              )}

              <div className="flex gap-3">
                <Link to={`/products/${categorySlug}`} className="flex-1">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full">
                    ← Back to {category.name}
                  </Button>
                </Link>
                {product.ctaLink && (
                  <Button size="lg" variant="ghost" className="text-lg px-8 py-6" asChild>
                    <a href={product.ctaLink} target="_blank" rel="noopener noreferrer">
                      Official Site →
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card className="border-2 border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-blue-600 text-xl mt-0.5">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <Card className="border-2 border-gray-200 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">Compatibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.compatibility.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Technical Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <Card className="border-2 border-gray-200 shadow-lg mb-12">
            <CardHeader>
              <CardTitle className="text-3xl">Technical Specifications</CardTitle>
              <CardDescription>Detailed product specifications and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-semibold text-gray-900 capitalize min-w-[140px]">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-700">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders over $100</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </Card>
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">↩️</div>
            <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </Card>
        </div>
      </div>
    </div>
  );
}