
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../api/products";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery(
    ["product", id],
    () => getProductById(id!),
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return <p className="p-6">Loading product details...</p>;
  }

  if (isError || !data) {
    return <p className="p-6">Failed to load product details.</p>;
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link to="/" className="mb-6 inline-block text-blue-600">
        ← Back to Products
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <img
          src={data.thumbnail}
          alt={data.title}
          className="h-80 w-full rounded-lg border object-contain"
        />

        <div>
          <h1 className="mb-4 text-3xl font-bold">
            {data.title}
          </h1>

          <p className="mb-3 text-xl text-blue-600">
            ${data.price}
          </p>

          <p className="mb-4">
            ⭐ Rating: {data.rating}
          </p>

          <p className="text-gray-600">
            {data.description}
          </p>
        </div>
      </div>
    </main>
  );
}
