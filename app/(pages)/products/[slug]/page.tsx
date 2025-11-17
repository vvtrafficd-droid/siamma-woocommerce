import Image from "next/image";
import React from "react";
import AddToCart from "./AddtoCart";
import SimpleProductView from "./SimpleProductView";
import VariableProductView from "./VariableProductView";
import { WooProduct } from "@/types/woo";
import { Breadcrumb } from "@/components/Breadcrumb";
import ProductDescription from "./ProductDescription";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

// ✅ Generate dynamic metadata
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const slug = (await params).slug;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      title: "Product not found | YourStoreName",
      description: "Sorry, this product could not be found.",
    };
  }

  const product: WooProduct = await res.json();

  return {
    title: `${product.name} | ${siteConfig.title}`,
    description:
      product.short_description?.replace(/<[^>]*>?/gm, "").slice(0, 150) ||
      "Buy this amazing product at YourStoreName.",
    openGraph: {
      title: product.name,
      description:
        product.short_description?.replace(/<[^>]*>?/gm, "").slice(0, 150) ||
        "Check out this product on YourStoreName.",
      images: [
        {
          url: product.images?.[0]?.src || "/placeholder.png",
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description:
        product.short_description?.replace(/<[^>]*>?/gm, "").slice(0, 150) ||
        "Check out this product on YourStoreName.",
      images: [product.images?.[0]?.src || "/placeholder.png"],
    },
  };
}

// ✅ Page Component
const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const product: WooProduct = await res.json();

  return (
    <>
      <Breadcrumb
        links={[
          { title: "Home", href: "/" },
          { title: "Shop", href: "/shop" },
          { title: product.name, href: "#" },
        ]}
      />

      <div className="container mx-auto px-4 py-10 bg-white">
        {product.type === "simple" && <SimpleProductView product={product} />}
        {product.type === "variable" && <VariableProductView product={product} />}
      </div>

      <div className="w-full bg-gray-100">
        <div className="container mx-auto px-4">
          <ProductDescription product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductPage;
