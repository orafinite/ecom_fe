import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card as UiCard,
  CardTitle,
  CardDescription as UiCardDescription,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface Category {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products: any[];
}

interface CatalogData {
  categories: Category[];
}

const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {children}
    </div>
  );
};

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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
        if (mounted) setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error('Error loading categories:', err);
        if (mounted) setError(String(err?.message ?? 'Failed to load categories'));
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
          <p className="text-lg text-gray-600 max-w-2xl">
            Premium quality products designed for modern living
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <CardGrid>
        {loading ? (
          <div className="col-span-3 p-6 text-center text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="col-span-3 p-6 text-center text-red-500">
            Error loading categories: {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-3 p-6 text-center text-gray-500">No categories found.</div>
        ) : (
          categories.map((category, i) => {
            const imgSrc = category.image
              ? category.image.startsWith('http') || category.image.startsWith('/')
                ? category.image
                : `/assets/images/${category.image}`
              : undefined;

            const productCount = category.products?.length || 0;

            return (
              <Link key={i} to={`/products/${category.slug}`} className="block">
                <UiCard className="p-0 gap-1 relative overflow-hidden bg-white h-full group cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:z-10">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shrink-0 m-0">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover m-0 block transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-6xl mb-4 opacity-20">📦</div>
                        <span className="text-gray-400 text-lg font-bold uppercase tracking-wider">
                          {category.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="border-t border-gray-100" />

                  <CardContent className="flex-1 flex flex-col justify-between px-6 py-5">
                    <div>
                      <CardTitle className="text-2xl mb-3 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </CardTitle>

                      {category.description && (
                        <UiCardDescription className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </UiCardDescription>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                          {productCount} {productCount === 1 ? 'product' : 'products'}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                        >
                          View All →
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
    </div>
  );
}