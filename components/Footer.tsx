"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const valid = /.+@.+\..+/.test(email);
    if (!valid) {
      setMessage("Email inválido");
      return;
    }
    setLoading(true);
    try {
      const local = email.split("@")[0] || "Cliente";
      const firstName = local.charAt(0).toUpperCase() + local.slice(1);
      const lastName = "Newsletter";
      const res = await fetch(`${baseUrl}/api/customers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, country: "Portugal" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Falha na subscrição");
        return;
      }
      setMessage("Subscreveu com sucesso! Obrigado, breve você receberá promoções e novidades.");
      setEmail("");
    } catch {
      setMessage("Falha na subscrição");
    } finally {
      setLoading(false);
    }
  };
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
          <p>
            Endereço: N105 1449, 4835-517 Nespereira, Portugal <br />
Telefone: <a href="tel:+351253591298" className="hover:text-gray-900 hover:underline">+351 253 591 298</a> <br />
Horário de funcionamento: 
Aberto ⋅ Fecha 19:30
          </p>


        </div>

        {/* Column 3: Information */}
        <div>
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Siamma</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-gray-900 hover:underline">Sobre a Siamma</Link></li>
            <li><Link href="/privacy" className="hover:text-gray-900 hover:underline">Política de Privacidade</Link></li>
            <li><Link href="/terms" className="hover:text-gray-900 hover:underline">Termos e Condições</Link></li>
            <li><Link href="/cookies" className="hover:text-gray-900 hover:underline">Política de Cookies</Link></li>
            <li>
              <button
                type="button"
                className="hover:text-gray-900 hover:underline"
                onClick={() => document.dispatchEvent(new Event("open-cookie-preferences"))}
              >
                Preferências de Cookies
              </button>
            </li>

          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="text-gray-900 text-lg font-semibold mb-4">Receba ofertas</h3>
          <p className="text-sm mb-4">
            Receba ofertas e novidades diretamente no seu e-mail.
          </p>
          <form className="flex" onSubmit={onSubmit}>
            <input
              type="email"
              placeholder="Seu email"
              className="w-full px-3 py-2 rounded-l-md text-gray-800 focus:outline-none border border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md"
              disabled={loading}
            >
              {loading ? "A inscrever..." : "Inscrever"}
            </button>
          </form>
          {message && (
            <div className={"text-sm mt-2 " + (message.includes("sucesso") ? "text-green-600" : "text-red-600")}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {siteConfig.title}. Todos os direitos reservados. Desenvolvido por <a href="https://vvtrafficdata.pt" className="hover:underline">VV Traffic Data</a>.
      </div>
    </footer>
  );
};

export default Footer;
