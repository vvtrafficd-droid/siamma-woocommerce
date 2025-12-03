"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loginType, setLoginType] = useState<"particular" | "empresa">("particular");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/customers/find?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Falha no login");
      }
      const customer = data.customer;
      login({ email: customer?.email, customerId: customer?.id, customer });
      router.push("/orders");
    } catch (err: any) {
      setError(err?.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        links={[{ title: "Início", href: "/" }, { title: "Entrar", href: "#" }]}
      />
      <section className="w-full bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="loginType"
                      value="particular"
                      checked={loginType === "particular"}
                      onChange={() => setLoginType("particular")}
                      className="accent-green-600"
                    />
                    <span>Particular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="loginType"
                      value="empresa"
                      checked={loginType === "empresa"}
                      onChange={() => setLoginType("empresa")}
                      className="accent-green-600"
                    />
                    <span>Empresa</span>
                  </label>
                </div>
                <div>
                  <Label htmlFor="email">
                    {loginType === "particular" ? "Email" : "Nº de Contribuinte / NIPC"}
                  </Label>
                  <Input
                    id="email"
                    type={loginType === "particular" ? "email" : "text"}
                    placeholder={loginType === "particular" ? "joao@email.com" : "123456789"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full bg-green-600 text-white py-6 text-lg" disabled={loading}>
                  {loading ? "A entrar..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}