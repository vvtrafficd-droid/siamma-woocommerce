"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/authStore";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function OrdersPage() {
  const { email: storedEmail, customerId } = useAuthStore();
  const [email, setEmail] = useState(storedEmail || "");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (opts?: { email?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const qs = customerId
        ? `customerId=${customerId}`
        : opts?.email || email
          ? `email=${encodeURIComponent(opts?.email || email)}`
          : "";
      if (!qs) {
        setOrders([]);
        return;
      }
      const res = await fetch(`${baseUrl}/api/orders?${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha a carregar pedidos");
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err: any) {
      setError(err?.message || "Falha a carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    fetchOrders({ email });
  };

  return (
    <>
      <Breadcrumb
        links={[{ title: "Início", href: "/" }, { title: "Últimos pedidos", href: "#" }]}
      />
      <section className="w-full bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Procurar pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 text-white py-6 text-lg" disabled={loading}>
                    {loading ? "A carregar..." : "Ver pedidos"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Últimos pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                {loading && <p className="text-sm text-gray-600">A carregar pedidos...</p>}
                {!loading && orders.length === 0 && (
                  <p className="text-gray-600">Nenhum pedido encontrado.</p>
                )}
                {!loading && orders.length > 0 && (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-md bg-white">
                        <div>
                          <div className="font-semibold">Pedido #{o.id}</div>
                          <div className="text-sm text-gray-600">{new Date(o.date_created).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Estado: {o.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">Total: {o.total}€</div>
                          <div className="text-sm text-gray-600">Itens: {Array.isArray(o.line_items) ? o.line_items.reduce((s: number, i: any) => s + i.quantity, 0) : 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}