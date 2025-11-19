"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
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
    categories,
    images,
  } = product;

  const imageUrl = images?.[0]?.src || "/no-image.svg";

  return (
    <div className="group overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-md">
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
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const addToCart = useCartStore.getState().addToCart;
            addToCart({
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              regular_price: product.regular_price,
              sale_price: product.sale_price,
              images: imageUrl,
              type: "simple",
            });
            toast.success("Produto adicionado ao carrinho!");
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700 flex items-center justify-center shadow-md"
          aria-label="Adicionar ao carrinho"
        >
          <i className="ri-add-line text-lg"></i>
        </button>
        {on_sale && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Sale
          </span>
        )}
      </Link>

      <div className="mt-2 px-3 pb-4">
        <div className="text-xs text-gray-400">
          {categories?.map((cat) => (
            <span key={cat.id} className="mr-2 capitalize">
              {cat.name}
            </span>
          ))}
        </div>

        <Link
          href={`/products/${slug}`}
          className="text-base font-medium text-gray-800 transition line-clamp-2 hover:text-green-600"
        >
          {name}
        </Link>

        
        <div className="flex items-center gap-2 mt-2">
          {on_sale ? (
            <>
              <span className="text-sm font-bold text-gray-900">
                {siteConfig.currency} {sale_price}
              </span>
              <span className="text-sm line-through text-gray-400">
                {siteConfig.currency} {regular_price}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-900 font-medium">
              {siteConfig.currency} {regular_price || price || "—"}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
