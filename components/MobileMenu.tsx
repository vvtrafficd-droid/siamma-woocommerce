"use client";
import React from "react";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { siteConfig } from "@/lib/config";

const navItems = [
    { name: "Início", href: "/" },
    { name: "Loja", href: "/shop" },
    { name: "Sobre", href: "/about" },
    { name: "Contacto", href: "/contact" },
];

const MobileMenu = () => {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <i className="ri-menu-line text-2xl"></i>
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side="right"
                    className="w-3/4 sm:max-w-sm bg-white overflow-y-auto"
                >
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                        <SheetTitle>
                            {siteConfig.logoName || siteConfig.title}
                        </SheetTitle>
                        <SheetClose asChild>
                            <button>
                                <i className="ri-close-line text-2xl"></i>
                            </button>
                        </SheetClose>
                    </div>

                    <nav className="flex flex-col space-y-4 p-4">
                        {navItems.map((item) => (
                            <SheetClose asChild key={item.name}>
                                <Link
                                    href={item.href}
                                    className="text-gray-700 font-medium hover:text-green-600 transition"
                                >
                                    {item.name}
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileMenu;
