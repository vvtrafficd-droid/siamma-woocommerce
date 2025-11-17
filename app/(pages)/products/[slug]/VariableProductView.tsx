"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import AddToCart from "./AddtoCart";
import { WooProduct } from "@/types/woo";
import AddToCartVariation from "./AddtoCartVariation";
import { siteConfig } from "@/lib/config";
import { Separator } from "@/components/ui/separator";
import { set } from "nprogress";
import { Button } from "@/components/ui/button";

const VariableProductView = ({ product }: { product: WooProduct }) => {
  const mainImage = product.images?.[0]?.src || "/placeholder.png";
  const gallery = product.images?.slice(1) || [];
  const description = product.short_description?.replace(/<[^>]*>?/gm, "") || "";
  console.log(product);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [productVariations, setProductVariations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch product variations dynamically
  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const res = await fetch(`/api/products/variations/${product.id}`);
        const data = await res.json();
        setProductVariations(data);
      } catch (err) {
        console.error("Error fetching variations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (product.type === "variable") fetchVariations();
  }, [product.id, product.type]);

  useEffect(() => {
    if (!product?.attributes) return;

    // Create an object with first options
    const defaultOptions: Record<string, string> = {};
    product.attributes.forEach((attr) => {
      if (attr.variation && attr.options?.length > 0) {
        defaultOptions[attr.name] = attr.options[0];
      }
    });

    setSelectedOptions(defaultOptions);
  }, [product]);


  // ✅ Handle attribute selection
  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Match selected variation
  useEffect(() => {
    if (!productVariations.length) return;
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[\s+]+/g, "-"); // replace spaces and '+' with '-'

    const matched = productVariations.find((variation: any) =>
      Object.entries(selectedOptions).every(([attr, val]) =>
        (variation.attributes || []).some((a: any) => {
          const attrName = normalize(a.name);
          const selectedAttr = normalize(attr);
          const optionVal = normalize(a.option);
          const selectedVal = normalize(val);

          return attrName === selectedAttr && optionVal === selectedVal;
        })
      )
    );

    setSelectedVariation(matched || null);
  }, [selectedOptions, productVariations]);

  const rating = parseFloat(product.average_rating || "0");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ✅ Product Image Gallery */}
      <div className="space-y-4">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={selectedVariation?.image?.src || mainImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Thumbnails */}
        {gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {gallery.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={img.src}
                  alt={img.alt || product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Product Info */}
      <div>

        {(product.on_sale || selectedVariation?.on_sale) && (
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
            {selectedVariation?.stock_status === "instock" ? <span className="text-blue-500"><i className="ri-checkbox-circle-line"></i> InStock</span> : <span className="text-red-500"><i className="ri-close-circle-line"></i> OutStock</span>}
          </div>

        </div>



        <div className="text-2xl font-medium text-gray-900 mb-3">
          {selectedVariation ? (
            selectedVariation.on_sale ? (
              <>
                <span className="text-red-600">
                  {siteConfig.currency} {selectedVariation.sale_price}
                </span>{" "}
                <span className="line-through text-gray-400">
                  {siteConfig.currency} {selectedVariation.regular_price}
                </span>
              </>
            ) : (
              <span>
                {siteConfig.currency} {selectedVariation.price}
              </span>
            )
          ) : product?.price ? (
            <span>
              {siteConfig.currency} {product.price}
            </span>
          ) : (
            <span>—</span>
          )}
        </div>
        <div>

        </div>


        {description && (
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: description

            }}
          />
        )}

        <Separator className="bg-gray-300 my-3 mt-6" />
        {/* ✅ Variation Radio Buttons */}
        {!loading &&
          product.attributes?.map(
            (attr) =>
              attr.variation && (
                <div key={attr.id} className="mb-5 mt-5r gap-3">
                  <label className="block text-md font-">
                    {attr.name}:
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {attr.options.map((opt: string) => {
                      const isSelected = selectedOptions[attr.name] === opt;
                      return (
                        <label
                          key={opt}
                          className={`cursor-pointer border rounded-lg px-4 py-2 text-sm font-medium transition-all ${isSelected
                            ? "border-blue-600 bg-blue-200 text-blue-800"
                            : "border-gray-300 hover:border-blue-400"
                            }`}
                        >
                          <input
                            type="radio"
                            name={attr.name}
                            value={opt}

                            checked={isSelected}
                            onChange={(e) =>
                              handleOptionChange(attr.name, e.target.value)
                            }
                            className="hidden"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )
          )}


        <Separator className="bg-gray-300 my-3 mb-6" />

        {/* ✅ Add to Cart */}
        {selectedVariation?.stock_status === "instock" ? <AddToCartVariation product={product} variation={selectedVariation} /> : <Button className="bg-gray-300 border-gray-400 border px-5 py-2" disabled>Out of Stock</Button>}


        <div className="mt-10 text-gray-500 text-md space-y-2">
          <div className="">
            SKU: {selectedVariation?.sku || product.sku || 'N/A'}
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

export default VariableProductView;
