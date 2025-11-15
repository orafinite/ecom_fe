import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card as UiCard,
  CardTitle,
  CardDescription as UiCardDescription,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
}

interface Category {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: ProductItem[];
}

interface CatalogData {
  categories: Category[];
}

const slugify = (s?: string, index = 0) =>
  s
    ? s
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : String(index);

const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {children}
    </div>
  );
};

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/productscatalog.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch productscatalog.json');
        return r.json();
      })
      .then((data: CatalogData) => {
        const found = data.categories.find((cat) => cat.slug === categorySlug);
        if (mounted) {
          if (found) {
            setCategory(found);
          } else {
            setError('Category not found');
          }
        }
      })
      .catch((err) => {
        console.error('Error loading category:', err);
        if (mounted) setError(String(err?.message ?? 'Failed to load category'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500 text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Category not found</h2>
          <p className="mb-6 text-gray-600">
            We couldn't find the category you're looking for. It may have been removed or doesn't exist.
          </p>
          <Link to="/products">
            <Button size="lg">← Back to All Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Category Header */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-6 flex items-center gap-2">
            <Link to="/products" className="hover:text-blue-600 transition-colors">
              All Categories
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>

          {/* Category Title & Description */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-4 font-medium">
                {category.products.length}{' '}
                {category.products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>

            {/* Category Image (Optional) */}
            {category.image && (
              <div className="w-full lg:w-64 h-48 bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img
                  src={
                    category.image.startsWith('http') || category.image.startsWith('/')
                      ? category.image
                      : `/assets/images/${category.image}`
                  }
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <CardGrid>
        {category.products.length === 0 ? (
          <div className="col-span-4 p-12 text-center">
            <div className="text-6xl mb-4 opacity-30">📦</div>
            <p className="text-gray-500 text-lg">
              No products available in this category yet.
            </p>
            <Link to="/products" className="inline-block mt-6">
              <Button variant="outline">Browse Other Categories</Button>
            </Link>
          </div>
        ) : (
          category.products.map((product, i) => {
            const {
              title,
              description,
              ctaText = 'View Details',
              badge,
              image,
              price,
            } = product;

            const productSlug = slugify(title, i);
            const imgSrc = image
              ? image.startsWith('http') || image.startsWith('/')
                ? image
                : `/assets/images/${image}`
              : undefined;

            return (
              <Link
                key={i}
                to={`/products/${categorySlug}/${productSlug}`}
                className="block group"
              >
                <UiCard className="p-0 gap-1 relative overflow-hidden bg-white h-full cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:z-10">
                  {/* Product Image */}
                  <div className="relative aspect-4/5 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0 m-0">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover m-0 block transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-6xl mb-3 opacity-20">📦</div>
                        <span className="text-gray-400 text-sm font-medium">NO IMAGE</span>
                      </div>
                    )}

                    {badge && (
                      <Badge className="absolute top-4 left-4 z-10 shadow-lg" variant="default">
                        {badge}
                      </Badge>
                    )}

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Product Info */}
                  <CardContent className="flex-1 flex flex-col justify-between px-0">
                    <div>
                      <div className="flex items-start justify-between mb-2 pl-4 pr-4 pt-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                            {title}
                          </CardTitle>
                          {price && (
                            <div className="text-lg font-bold text-blue-600 mt-2">{price}</div>
                          )}
                        </div>
                      </div>

                      {description && (
                        <UiCardDescription className="mt-2 pl-4 pr-4 text-gray-600 text-sm line-clamp-2">
                          {description}
                        </UiCardDescription>
                      )}

                      <div className="pl-4 pr-4 pb-4 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                        >
                          {ctaText} →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </UiCard>
              </Link>
            );
          })
        )}
      </CardGrid>

      {/* Back to Categories Button */}
      <div className="max-w-7xl mx-auto px-6 pb-12 text-center">
        <Link to="/products">
          <Button variant="ghost" size="lg" className="text-lg">
            ← Back to All Categories
          </Button>
        </Link>
      </div>
    </div>
  );
}