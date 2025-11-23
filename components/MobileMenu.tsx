"use client";
import React from "react";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/config";
import Image from "next/image";
const navItems = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/about" },
  { name: "Contacto", href: "/contact" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const MobileMenu = () => {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <i className="ri-menu-line text-2xl"></i>
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-3/4 sm:max-w-sm bg-white overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <SheetTitle>
              <Image
                            src={siteConfig.logo}
                            alt={siteConfig.logoName}
                            height={80}
                            width={180}
                            className="object-contain"
                          />
            </SheetTitle>
            <SheetClose asChild>
              <button>
                <i className="ri-close-line text-2xl"></i>
              </button>
            </SheetClose>
          </div>

          <div className="p-4 space-y-6">
            <div>
              <div className="text-xs uppercase text-gray-500 mb-2">Categorias</div>
              <nav className="flex flex-col">
                <SheetClose asChild>
                  <Link href="/shop" className="px-2 py-2 rounded hover:bg-gray-100 text-gray-800">Todos</Link>
                </SheetClose>
                {loading && (
                  <div className="px-2 py-1 text-sm text-gray-500">A carregar…</div>
                )}
                {!loading && categories.map((cat) => (
                  <SheetClose asChild key={cat.id}>
                    <Link href={`/shop?category=${cat.id}`} className="px-2 py-2 rounded hover:bg-gray-100 text-gray-800 capitalize">
                      {cat.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </div>

            <div>
              <div className="text-xs uppercase text-gray-500 mb-2">Links</div>
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link href={item.href} className="px-2 py-2 rounded hover:bg-gray-100 text-gray-800">
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
