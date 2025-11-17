"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "@/app/(pages)/products/[slug]/AddtoCart";
import { WooProduct } from "@/types/woo";
import { siteConfig } from "@/lib/config";

const ProductCard: React.FC<{ product: WooProduct }> = ({ product }) => {
  const {
    name,
    slug,
    price,
    regular_price,
    sale_price,
    on_sale,
    average_rating,
    rating_count,
    categories,
    images,
  } = product;

  const imageUrl = images?.[0]?.src || "/no-image.png";
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
            <span key={cat.id} className="mr-2">
              {cat.name}
            </span>
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
          {on_sale ? (
            <>
              <span className="text-md font-bold text-gray-900">
                {siteConfig.currency} {sale_price}
              </span>
              <span className="text-md line-through text-gray-400">
                {siteConfig.currency} {regular_price}
              </span>
            </>
          ) : (
            <span className="text-md text-gray-900 font-medium">
              {siteConfig.currency} {regular_price || price || "—"}
            </span>
          )}
        </div>

        {/* 🛒 Add to Cart */}
        {/* <div className="flex gap-2 pt-3">
          <AddToCart product={product} />
        </div> */}
      </div>
    </div>
  );
};

export default ProductCard;
