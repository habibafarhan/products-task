import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Gem, Search, ShoppingBag, Star } from "../components/icons";
import { Card } from "../components/ui/card";
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
  PRODUCTS_PER_PAGE,
} from "../api/products";

const NAV_LINKS = ["Shop", "Collections", "Contact", "About"];

const CATEGORIES = [
  { label: "All Products", value: "all" },
  { label: "Skincare", value: "skin-care" },
  { label: "Fragrances", value: "fragrances" },
  { label: "Makeup", value: "beauty" },
];

export default function Products() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce only the text box; the API data itself stays in React Query.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching, refetch } = useQuery(
    ["products", search, category, page],
    () => {
      if (search) return searchProducts(search, page);
      if (category !== "all") return getProductsByCategory(category, page);
      return getProducts(page);
    },
    { keepPreviousData: true }
  );

  const totalPages = Math.ceil((data?.total || 0) / PRODUCTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-[#ececec] p-3 sm:p-4">
      <div className="mx-auto max-w-6xl space-y-3">
       
         <header className="flex items-center gap-2">
  <div className="flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-lg font-semibold">
    <Gem className="h-4 w-4" /> crystal.
  </div>

  <label className="relative flex min-w-0 flex-1 items-center">
    <input
      type="text"
      value={searchInput}
      onChange={(event) => setSearchInput(event.target.value)}
      placeholder="SEARCH"
      aria-label="Search products"
      className="w-full rounded-xl bg-white py-3 pl-4 pr-10 text-xs uppercase tracking-wide outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-[#1f5c3a]"
    />
    <Search className="absolute right-3 h-4 w-4 text-neutral-600" />
  </label>
</header>

        {/* Hero */}
        <section className="grid items-center gap-6 rounded-2xl bg-white p-6 sm:p-8 md:grid-cols-2">
          <h1 className="text-5xl font-medium tracking-tight sm:text-6xl">
            Explore Our Shop
          </h1>
          <p className="text-xs leading-relaxed text-neutral-700 md:max-w-sm md:justify-self-end">
            From skincare to makeup, our platform features a wide range of
            products that cater to all your beauty needs. We strive to provide
            our customers with a luxury shopping experience, from browsing
            through our carefully selected products to receiving them in our
            signature packaging. Shop with us for the ultimate in beauty luxury.
          </p>
        </section>

        {/* Filters + grid */}
        <section className="rounded-2xl bg-white p-3 sm:p-4">
          <div className="mb-3 inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-neutral-200 p-1">
            {CATEGORIES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setCategory(item.value);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${
                  category === item.value
                    ? "bg-neutral-100 font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-[#f3f3f3]" />
              ))}
            </div>
          )}

          {isError && (
            <div className="py-16 text-center">
              <p className="text-sm text-neutral-700">
                We couldn’t load the products. Check your connection and try
                again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-[#1f5c3a] px-5 py-2 text-xs text-white"
              >
                Try again
              </button>
            </div>
          )}

          {data && data.products.length === 0 && (
            <p className="py-16 text-center text-sm text-neutral-600">
              No products match “{search}”. Try a different keyword.
            </p>
          )}

          {data && data.products.length > 0 && (
            <div
              className={`grid grid-cols-2 gap-3 lg:grid-cols-4 ${
                isFetching ? "opacity-60" : ""
              }`}
            >
              {data.products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  aria-label={`View details for ${product.title}`}
                  className="block"
                >
                  <Card className="flex h-full flex-col items-center bg-[#f3f3f3] px-4 pb-5 pt-6 text-center transition-colors hover:bg-[#e9e9e9]">
                    <div className="flex h-40 w-full items-center justify-center">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <h2 className="mt-4 text-sm font-medium uppercase tracking-wide text-neutral-900">
                      {product.title}
                    </h2>

                    {product.brand && (
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-400">
                        {product.brand}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
                      <span>${product.price.toFixed(2)}</span>
                      <span className="flex items-center gap-0.5 text-xs text-neutral-500">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPage((current) => current - 1)}
                disabled={page === 1}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}