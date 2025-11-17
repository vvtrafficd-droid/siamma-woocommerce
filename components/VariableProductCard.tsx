"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { WooProduct } from "@/types/woo";
import { siteConfig } from "@/lib/config";

const VariableProductCard: React.FC<{ product: WooProduct }> = ({ product }) => {
  const {
    name,
    slug,
    images,
    categories,
    on_sale,
    type,
    price,
    variations = [],
    average_rating,
    rating_count,
  } = product;

  const isVariable = type === "variable";
  const imageUrl = images?.[0]?.src || "/no-image.png";

  // 🧮 Calculate price range for variable products
  const prices =
    Array.isArray(variations) && typeof variations[0] === "object"
      ? variations.map((v: any) => parseFloat(v.display_price || v.price || 0))
      : [];

  const minPrice = prices.length ? Math.min(...prices) : parseFloat(price || "0");
  const maxPrice = prices.length ? Math.max(...prices) : minPrice;

  // ⭐ Convert rating to number
  const rating = parseFloat(average_rating || "0");

  return (
    <div className="group overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-md">
      {/* Product Image */}
      <Link
        href={`/products/${slug}`}
        className="block relative w-full rounded-md aspect-square p-2 bg-gray-50 overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover w-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {on_sale && (
          <span className="absolute top-3 right-3 bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Sale
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="mt-2 px-3 pb-4">
        {/* Category */}
        <div className="text-xs text-gray-400">
          {categories?.map((cat) => (
            <span key={cat.id} className="mr-2">{cat.name}</span>
          ))}
        </div>

        {/* Title */}
        <Link
          href={`/products/${slug}`}
          className="text-lg font-medium text-gray-800 transition line-clamp-2 hover:text-blue-600"
        >
          {name}
        </Link>

        {/* ⭐ Ratings */}
        {rating_count >= 0 && (
          <div className="flex items-center gap-1 text-xs">
            {[...Array(5)].map((_, i) => (
                <i key={i} className={"ri-star-fill " +`${
                  i < Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}></i>
              
            ))}
            <span className="text-xs text-gray-500 h-full flex items-center">
              ({rating_count})
            </span>
          </div>
        )}

        {/* 💰 Price */}
        <div className="flex items-center gap-2 mt-2">
            <span className="text-md text-gray-900 font-medium">
              From {siteConfig.currency} {minPrice}
              {maxPrice !== minPrice && ` - ${siteConfig.currency} ${maxPrice}`}
            </span>
        </div>

        {/* 🛒 Button */}
        {/* <div className="flex gap-2 pt-3">
          <Link
            href={`/products/${slug}`}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
          >
            <i className="ri-eye-line mr-2"></i> View Product
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default VariableProductCard;
