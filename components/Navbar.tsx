"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "remixicon/fonts/remixicon.css";
import MobileMenu from "./MobileMenu";
import { useCartStore } from "@/store/cartStore";
import CartSlider from "./CartSlider";
import { siteConfig } from "@/lib/config";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { items } = useCartStore();
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop?search=${encodeURIComponent(q)}&page=1`);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/" className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            {siteConfig.logo ? (
              <Image
                src={siteConfig.logo}
                alt={siteConfig.logoName}
                height={40}
                width={40}
                className="object-contain"
              />
            ) : (
              siteConfig.logoName
            )}
          </Link>
        </div>

        <form onSubmit={onSubmit} className="flex-1">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <i className="ri-search-line text-lg text-gray-500"></i>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquise por item"
              className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0"
            />
            <Button type="submit" variant="ghost" size="icon">
              <i className="ri-search-line text-xl"></i>
            </Button>
          </div>
        </form>

        <div className="flex items-center gap-3">
          <CartSlider />
        </div>
      </div>
    </header>
  );
}
