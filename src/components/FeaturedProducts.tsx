import { useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { products } from '@/data/products';

export default function FeaturedProducts() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Products');
  const [limit, setLimit] = useState(6);

  const categories = [
    'All Products',
    ...new Set(products.map(product => product.category)),
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      category === 'All Products' ||
      product.category === category;

    const searchableText = [
      product.title,
      product.description,
      product.category,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      query.trim().toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  function resetFilters() {
    setQuery('');
    setCategory('All Products');
    setLimit(6);
  }

  return (
    <section
      id="featured-products"
      aria-labelledby="shop-heading"
      className="section-shell bg-muted/30"
    >
      <div className="section-inner">
        {/* Section heading */}
        <p className="eyebrow">Curated marketplace</p>

        <h2 id="shop-heading" className="section-heading">
          Shop products
        </h2>

        <p className="section-description">
          Discover products by category. Purchases happen on Amazon;
          check current prices and availability there.
        </p>

        {/* Search and filters */}
        <div className="tool-panel mt-8">
          <label htmlFor="product-search">
            Search products
          </label>

          <input
            id="product-search"
            type="search"
            placeholder="Search by product name or category"
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setLimit(6);
            }}
          />

          <div
            role="group"
            aria-label="Product categories"
            className="flex flex-wrap gap-2"
          >
            {categories.map(item => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                className={
                  category === item
                    ? 'action'
                    : 'secondary-action'
                }
                onClick={() => {
                  setCategory(item);
                  setLimit(6);
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <p
              role="status"
              aria-live="polite"
              className="text-sm text-muted-foreground"
            >
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'product'
                : 'products'}
              {' · '}
              {category}
            </p>

            {(query || category !== 'All Products') && (
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-11 underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="mt-6 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.slice(0, limit).map(product => (
            <article
              key={product.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Same-size image area for every product */}
              <div className="relative aspect-[4/3] shrink-0 bg-muted/40">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain p-6"
                />
              </div>

              {/* Product information */}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs text-muted-foreground">
                  {product.category}
                </p>

                <h3 className="mt-2 min-h-[3.5rem] text-lg font-semibold leading-snug">
                  {product.title}
                </h3>

                <details className="mt-3 text-sm">
                  <summary className="min-h-11 cursor-pointer py-2 font-medium text-muted-foreground">
                    Product details
                  </summary>

                  <p className="pb-3 leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </details>

                {/* Rating and button stay together at the bottom */}
                <div className="mt-auto pt-5">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0"
                    />

                    Listed rating: {product.rating}/5
                  </p>

                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${product.title} on Amazon (opens in a new tab)`}
                    className="action mt-4 w-full"
                  >
                    View on Amazon

                    <ExternalLink
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No matching products */}
        {filteredProducts.length === 0 && (
          <div className="tool-panel mt-6 text-center">
            <p>No products match your search.</p>

            <button
              type="button"
              className="secondary-action"
              onClick={resetFilters}
            >
              Show all products
            </button>
          </div>
        )}

        {/* Load more products */}
        {limit < filteredProducts.length && (
          <div className="mt-8 text-center">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setLimit(current => current + 6)}
            >
              Show more products
              {' '}
              ({filteredProducts.length - limit} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}