import Image from "next/image";
import React from "react";
import AddToCart from "./AddtoCart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/config";

// ✅ Types
interface WooImage {
  id: number;
  src: string;
  alt: string;
}

interface WooCategory {
  id: number;
  name: string;
  slug: string;
}

interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  stock_status: string;
  average_rating: string;
  rating_count: number;
  type: string;
  sku: string;
  categories: WooCategory[];
  images: WooImage[];
}

// ✅ Component
const SimpleProductView = async ({product}:{product:WooProduct}) => {


  const rating = parseFloat(product.average_rating || "0");
  return (
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ✅ Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images?.[0]?.src || "/placeholder.png"}
              alt={product.images?.[0]?.alt || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnail images */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Product Info */}
        <div>

        {(product.on_sale) && (
          <p className="text-sm text-green-600 mb-1 font-medium">On Sale 🎉</p>
        )}

        <h1 className="text-4xl font-semibold mb-1">{product.name}</h1>

        <div className="flex gap-3 my-4">
          {/* ⭐ Ratings */}
          {product.rating_count >= 0 && (
            <div className="flex items-center gap-1 text-md">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={"ri-star-fill " + `${i < Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
                  }`}></i>

              ))}
              <span className="text-md text-gray-500 h-full flex items-center">
                ({product.rating_count} Customer Reviews)
              </span>
            </div>
          )}

          <div>
            {product?.stock_status === "instock" ? <span className="text-blue-500"><i className="ri-checkbox-circle-line"></i> InStock</span> : <span className="text-red-500"><i className="ri-close-circle-line"></i> OutStock</span>}
          </div>

        </div>



        <div
          className="text-2xl font-medium text-gray-900 mb-3"
          dangerouslySetInnerHTML={{
            __html:
              (siteConfig.currency + ' ' + product?.sale_price) ||
              siteConfig.currency + ' ' + product?.regular_price ||
              "<span>—</span>",
          }}
        />
        <div>

        </div>


        {product.short_description && (
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: product.short_description

            }}
          />
        )}

        <Separator className="bg-gray-300 my-3 mt-6" />

        {/* ✅ Add to Cart */}
        {product?.stock_status === "instock" ? <AddToCart product={product}  /> : <Button className="bg-gray-300 border-gray-400 border px-5 py-2" disabled>Out of Stock</Button>}


        <div className="mt-10 text-gray-500 text-md space-y-2">
          <div className="">
            SKU: {product?.sku || 'N/A'}
          </div>
          {/* ✅ Categories */}
          {product.categories?.length > 0 && (
            <div className="flex items-center mb-2">
              <h3 className="">Categories:&nbsp;</h3>
              <ul className="">
                {product.categories.map((cat) => (
                  <span key={cat.id}>{cat.name}</span>

                ))}
              </ul>
            </div>
          )}
        </div>



      </div>
      </div>
  );
};

export default SimpleProductView;
