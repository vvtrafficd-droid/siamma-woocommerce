"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-300 text-gray-700 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Column 1: Brand Info */}
        <div>
         <img src="/logo.png" alt={siteConfig.title} className="w-44 h-auto mb-4" />
        
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-gray-900 hover:underline "><Facebook size={18} /></Link>
            <Link href="#" className="hover:text-gray-900 hover:underline"><Instagram size={18} /></Link>

          </div>
        </div>

        {/* Column 2: Customer Service */}
        <div>
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Informações</h3>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-gray-900 hover:underline">Contacto</Link></li>
            <li><Link href="#" className="hover:text-gray-900 hover:underline">Devolução e Entrega</Link></li>
          </ul>
        </div>

        {/* Column 3: Information */}
        <div>
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Siamma</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-gray-900 hover:underline">Sobre a Siamma</Link></li>
            <li><Link href="#" className="hover:text-gray-900 hover:underline">Política de Privacidade</Link></li>
            <li><Link href="#" className="hover:text-gray-900 hover:underline">Termos e Condições</Link></li>

          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Receba ofertas</h3>
          <p className="text-sm mb-4">
            Receba ofertas e novidades diretamente no seu e-mail.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Seu email"
              className="w-full px-3 py-2 rounded-l-md text-gray-800 focus:outline-none border border-gray-300"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
            >
              Inscrever
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {siteConfig.title}. Todos os direitos reservados
      </div>
    </footer>
  );
};

export default Footer;
