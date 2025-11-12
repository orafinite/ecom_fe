import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card as UiCard,
  CardTitle,
  CardDescription as UiCardDescription,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
// products are loaded at runtime from /productscatalog.json (served from public/)

interface ProductItem {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  image?: string;
  variant?: string;
}

const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {children}
    </div>
  );
};

export default function CardLayoutExample() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/productscatalog.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch productscatalog.json');
        return r.json();
      })
      .then((data: ProductItem[]) => {
        if (mounted) setProducts(data || []);
      })
      .catch((err) => {
        console.error('Error loading products:', err);
        if (mounted) setError(String(err?.message ?? 'Failed to load products'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Discover Our Collection</h1>
          <p className="text-lg text-gray-600 max-w-2xl">Premium quality products designed for modern living</p>
        </div>
      </section>

      {/* Card Grid */}
      <CardGrid>
        {loading ? (
          <div className="col-span-4 p-6 text-center text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="col-span-4 p-6 text-center text-red-500">Error loading products: {error}</div>
        ) : products.length === 0 ? (
          <div className="col-span-4 p-6 text-center text-gray-500">No products found.</div>
        ) : (
          products.map((item: ProductItem, i: number) => {
            const {
              title,
              subtitle,
              description,
              ctaText = 'Shop Now',
              badge,
              variant = 'default',
              image,
            } = item;

            // generate a simple slug from the title to link to the product detail page
            const slug = title
              ? title
                  .toString()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
              : String(i);

            // resolve image path: allow absolute/external URLs or public assets under /assets/images
            const imgSrc = image
              ? (image.startsWith('http') || image.startsWith('/')
                  ? image
                  : `/assets/images/${image}`)
              : undefined;

            return (
              <Link
                key={i}
                to={`/products/${slug}`}
                className={`block ${variant === 'featured' ? 'col-span-2 row-span-2 text-4xl' : ''}`}
              >
                <UiCard
                  className={`p-0 gap-1 relative overflow-hidden bg-white h-full group cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:z-10`}
                >
                <div className="relative aspect-4/5 bg-gray-100 overflow-hidden shrink-0 m-0">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover m-0 block"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-sm font-medium">UNDER CONSTRUCTION</span>
                    </div>
                  )}

                  {badge && (
                    <Badge className="absolute top-4 left-4 z-10" variant="default">
                      {badge}
                    </Badge>
                  )}
                </div>

                <div className="border-t border-gray-100" />

                <CardContent className="flex-1 flex flex-col justify-between px-0">
                  <div>
                    {subtitle && (
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-2 pl-4 mt-2">
                        {subtitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-2 pl-4">
                      <CardTitle>{title}</CardTitle>
                      <div className="ml-4 pr-4 shrink-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/products/${slug}`}>{ctaText}</Link>
                        </Button>
                      </div>
                    </div>

                    {description && (
                      <UiCardDescription
                        className={`mt-2 pl-4 pr-4 pb-5 ${
                          variant === 'featured' ? 'text-xl font-medium text-gray-700' : 'text-gray-600 text-sm'
                        }`}
                      >
                        {description}
                      </UiCardDescription>
                    )}
                  </div>
                </CardContent>
              </UiCard>
              </Link>
            );
          })
        )}
      </CardGrid>
    </div>
  );
}
