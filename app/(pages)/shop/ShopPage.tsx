"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { WooProduct, WooProductCategory } from "@/types/woo";
import { Breadcrumb } from "@/components/Breadcrumb";
import FilterShop from "@/components/shop/Filter";
import Pagination from "@/components/shop/Pagination";
import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";
import VariableProductCard from "@/components/VariableProductCard";
import MobileFilterMenu from "@/components/shop/MobileFilterMenu";
import CategorySlider from "@/components/home/CategorySlider";

const sortOptions = [
    { label: "Default", value: "rating" },
    { label: "Low to High", value: "price_asc" },
    { label: "High to Low", value: "price_desc" },
    { label: "Newest", value: "date" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function ShopPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<WooProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [categories, setCategories] = useState<WooProductCategory[]>([]);

    // ✅ Read filters from URL
    const selectedCategory = Number(searchParams.get("category")) || 0;
    const sortBy = searchParams.get("sortBy") || "date";
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";


    // 🧠 Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/categories`);
                const data = await res.json();
                setCategories(data || []);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // 🧩 Fetch Products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                ...(selectedCategory && selectedCategory !== 0 && { category: selectedCategory.toString() }),
                orderby: sortBy.includes("price") ? "price" : "date",
                order: sortBy.endsWith("desc") ? "desc" : "asc",
                page: page.toString(),
                per_page: "12",
            });

            if (search.trim()) params.set("search", search.trim());

            const res = await fetch(`${baseUrl}/api/products?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setProducts(data.products || []);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotalProducts(data.pagination?.total || 0);
            } else {
                console.error("Failed to fetch:", data.error);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, sortBy, page, search]);

    // ✅ Update URL parameters when user changes filter
    const updateParams = (updates: Record<string, string | number | undefined>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "" || value === 0) {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });
        router.push(`${pathname}?${newParams.toString()}`);
    };

    return (
        <div className="bg-gray-50">

            <Breadcrumb
                links={
                    (pathname === "/")
                        ? [{ title: 'Home', href: '/' }]
                        : [
                            { title: 'Home', href: '/' },
                            { title: 'Shop', href: '#' },
                          ]
                } />
            <CategorySlider categories={categories} />
            <div className="container mx-auto px-4 pb-10 mt-4">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <FilterShop />

                    {/* Main Content */}
                    <main className="md:col-span-3 space-y-4">
                        {/* Top Bar */}
                        <div className="bg-white shadow-xs border border-gray-200 rounded-md px-2 md:px-4 py-3 flex flex-row justify-between items-center gap-2">
                            <MobileFilterMenu />
                     

                            <Select
                                onValueChange={(value) => updateParams({ sortBy: value, page: 1 })}
                                defaultValue={sortBy}
                            >
                                <SelectTrigger className="w-[100px] md:w-[200px] border border-gray-200 shadow-none">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 ">
                                    {sortOptions.map((opt, id) => (
                                        <SelectItem key={id} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <ProductGridSkeleton />
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {products.map((product) => {
                                    if (product.type === "simple") {
                                        return <ProductCard key={product.id} product={product} />;
                                    } else if (product.type === "variable") {
                                        return <VariableProductCard key={product.id} product={product} />;
                                    } else if (product.type === "grouped") {
                                        // return <GroupedProductCard key={product.id} product={product} />;
                                        return null;
                                    } else {
                                        return null; // Fallback if type doesn't match
                                    }
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                No products found.
                            </div>
                        )}

                        <Pagination totalPages={totalPages} />

                    </main>
                </div>
            </div>
        </div>

    );
}
