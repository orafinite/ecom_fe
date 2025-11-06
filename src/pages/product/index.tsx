import React from 'react';
// images removed — cards are under construction for now
import {
  Card as UiCard,
  CardTitle,
  CardDescription as UiCardDescription,
  CardContent,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  image?: string;
  variant?: 'default' | 'featured' | 'product';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  description,
  ctaText = 'Shop Now',
  ctaLink = '#',
  badge,
  variant = 'default',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white h-full ${
        variant === 'featured' ? 'col-span-2 row-span-2' : ''
      } group cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:z-10`}
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-4/5 bg-gray-100 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm font-medium">UNDER CONSTRUCTION</span>
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="border-t border-gray-100 p-6 flex flex-col flex-1">
        {subtitle && (
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{subtitle}</p>
        )}

        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
            {title}
          </h3>

          <div className="ml-4 shrink-0">
            <a
              href={ctaLink}
              className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors border border-gray-300 px-2.5 py-1 rounded-md"
            >
              {ctaText}
              <svg
                className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {description && <p className="text-gray-600 text-sm mt-2 flex-1">{description}</p>}
      </div>
    </div>
  );
};

            // We'll use shadcn-style `UiCard` components for layout.
            // A small helper grid — kept simple and tailwind-friendly.
            const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
                  {children}
                </div>
              );
            };

            const exampleCards: CardProps[] = [
              {
                title: 'Flagship Laptop',
                subtitle: 'New Arrival',
                description:
                  'Our most powerful laptop featuring next-gen CPUs, long battery life, and a stunning display for creators and professionals.',
                badge: 'NEW',
                variant: 'featured',
                image: '/images/laptop.jpg',
              },
              {
                title: 'Wireless Headphones',
                subtitle: 'Audio',
                description: 'Immersive sound with active noise cancellation and long battery life for travel and work.',
                ctaText: 'Explore',
                image: '/images/headphones.jpg',
              },
              {
                title: '4K Monitor',
                subtitle: 'Display',
                description: 'Ultra-high-definition monitor with HDR and color accuracy for creative professionals.',
                badge: 'LIMITED',
                ctaText: 'View',
                image: '/images/monitor.jpg',
              },
              {
                title: 'Gaming Laptop',
                subtitle: 'Performance',
                description: 'High-refresh-rate display, powerful GPU, and thermal performance built for gaming.',
                badge: 'SALE',
                ctaText: 'Shop Sale',
                image: '/images/gaming.jpg',
              },
              {
                title: 'Smart Home Hub',
                subtitle: 'Home',
                description: 'Control lights, thermostats, and security with a single, secure hub.',
                image: '/images/smarthome.jpg',
              },
              {
                title: 'Mesh Wi‑Fi Router',
                subtitle: 'Networking',
                description: 'Whole-home coverage with fast throughput and easy setup.',
                badge: 'ECO',
                ctaText: 'Learn More',
                image: '/images/router.jpg',
              },
            ];

            // Example Usage Component
            export default function CardLayoutExample() {
              return (
                <div className="min-h-screen bg-white">
                  {/* Hero Section */}
                  <section className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-6">
                      <h1 className="text-5xl font-bold text-gray-900 mb-4">Discover Our Collection</h1>
                      <p className="text-lg text-gray-600 max-w-2xl">Premium quality products designed for modern living</p>
                    </div>
                  </section>

                  {/* Card Grid (rendered dynamically from exampleCards) using shadcn-style UI components */}
                  <CardGrid>
                    {exampleCards.map((c, i) => {
                      const {
                          title,
                          subtitle,
                          description,
                          ctaText = 'Shop Now',
                          ctaLink = '#',
                          badge,
                          variant = 'default',
                          image,
                        } = c;

                      return (
                        <UiCard
                          key={i}
                          className={`relative overflow-hidden bg-white h-full ${
                            variant === 'featured' ? 'col-span-2 row-span-2' : ''
                          } group cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:z-10`}
                        >
                          <div className="relative aspect-4/5 bg-gray-100 overflow-hidden shrink-0">
                              {image ? (
                                <img
                                  src={image}
                                  alt={title}
                                  className="absolute inset-0 w-full h-full object-cover"
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

                          <CardContent className="flex-1 flex flex-col justify-between">
                            <div>
                              {subtitle && (
                                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">{subtitle}</p>
                              )}

                              <div className="flex items-center justify-between mb-2">
                                <CardTitle>{title}</CardTitle>

                                <div className="ml-4 shrink-0">
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={ctaLink}>{ctaText}</a>
                                  </Button>
                                </div>
                              </div>

                              {description && (
                                <UiCardDescription className="mt-2">{description}</UiCardDescription>
                              )}
                            </div>
                          </CardContent>
                        </UiCard>
                      );
                    })}
                  </CardGrid>
                </div>
              );
            }