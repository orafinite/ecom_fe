import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const slugify = (s?: string, index = 0) =>
  s
    ? s
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    : String(index);

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/productscatalog.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch productscatalog.json');
        return r.json();
      })
      .then((data: any[]) => {
        const found = data.find((p: any, i: number) => slugify(p.title, i) === slug);
        if (mounted) setProduct(found ?? null);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error loading product detail:', err);
        if (mounted) setProduct(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-4">We couldn't find the product you're looking for.</p>
        <Link to="/products">
          <Button>Back to products</Button>
        </Link>
      </div>
    );
  }

  // resolve image URL: allow absolute/external URLs or public assets under /assets/images
  const imgSrc = product && (product as any).image
    ? ((product as any).image.startsWith('http') || (product as any).image.startsWith('/'))
      ? (product as any).image
      : new URL(`../../assets/images/${(product as any).image}`, import.meta.url).href
    : undefined;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 bg-gray-100 p-4 rounded">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt={product.title} className="w-full h-auto object-cover" />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">No image</div>
          )}
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          {product.subtitle && <p className="text-sm text-gray-500 mb-4">{product.subtitle}</p>}
          {product.badge && <div className="mb-4 text-sm font-medium">{product.badge}</div>}

          {product.description && <p className="text-gray-700 mb-6">{product.description}</p>}

          <div className="flex items-center gap-3">
            <Button asChild>
              <a href={(product as any).ctaLink ?? '#'}>{(product as any).ctaText ?? 'Buy now'}</a>
            </Button>

            <Link to="/products">
              <Button variant="ghost">Back</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
