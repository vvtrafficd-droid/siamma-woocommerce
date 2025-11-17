export const siteConfig = {
    currency : '€',
    logo: "/logo.png",
    logoName:"Siamma - Produtos Alimentares",
    title:"Siamma - Produtos Alimentares",
    description:"Next js based wooCommerce storefront.",
    minItemPrice:0,
    maxItemPrice:10000,
}

interface navItems {
    name: string;
    href: string;
    dropdown?: navItems[]
}

export const navItems:navItems[] = [
  { name: "Início", href: "/" },
  // {
  //   name: "Shop",
  //   dropdown: [
  //     { name: "All Products", href: "/shop" },
  //     { name: "Men's Wear", href: "/shop/mens" },
  //     { name: "Women's Wear", href: "/shop/womens" },
  //     { name: "Accessories", href: "/shop/accessories" },
  //   ],
  // },
  {
    name  :"Loja",
    href : "/shop",
  },
  { name: "Sobre", href: "/about" },
  { name: "Contacto", href: "/contact" },
];