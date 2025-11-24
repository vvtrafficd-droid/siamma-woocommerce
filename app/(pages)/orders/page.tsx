"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiBase = baseUrl || "";

function OrdersPageComponent() {
  const { email: storedEmail, customerId } = useAuthStore();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");
  const newOrder = searchParams.get("newOrder");

  const [email, setEmail] = useState(emailFromQuery || storedEmail || "");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const normalizeStatus = (raw: string) => {
    let s = String(raw || "").toLowerCase();
    if (s.startsWith("wc-")) s = s.slice(3);
    s = s.replace(/[\s_]+/g, "-");
    return s;
  };

  const statusMap: Record<string, { label: string; bg: string; text: string; border: string }> = {
    pending: { label: "Pendente", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
    processing: { label: "Em processamento", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
    "on-hold": { label: "Em espera", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
    completed: { label: "Concluído", bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
    cancelled: { label: "Cancelado", bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
    refunded: { label: "Reembolsado", bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-200" },
    failed: { label: "Falhado", bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
    trash: { label: "Removido", bg: "bg-neutral-100", text: "text-neutral-800", border: "border-neutral-200" },
    "delivery-route": { label: "Rota de entrega", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    "rota-de-entrega": { label: "Rota de entrega", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    "rota-entrega": { label: "Rota de entrega", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    "rotaentrega": { label: "Rota de entrega", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
    picking: { label: "Separação dos produtos", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    "separacao": { label: "Separação dos produtos", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    "separacao-dos-produtos": { label: "Separação dos produtos", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
    "separacao-produtos": { label: "Separação dos produtos", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200" },
  };

  const getStatusInfo = (raw: string) => {
    const key = normalizeStatus(raw);
    return statusMap[key] || { label: raw, bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" };
  };

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
      const res = await fetch(`${apiBase}/api/orders?${qs}`);
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
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const fetchInitialOrders = () => {
      if (customerId || storedEmail || emailFromQuery) {
        fetchOrders({ email: emailFromQuery || storedEmail });
      }
    };

    if (newOrder) {
      setTimeout(fetchInitialOrders, 2000);
    } else {
      fetchInitialOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, customerId, storedEmail, emailFromQuery, newOrder]);

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
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" disabled={!!storedEmail} />
                    {storedEmail && (
                      <p className="text-xs text-gray-500 mt-1">Usando o email da sessão.</p>
                    )}
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
                    {orders.map((o) => {
                      const s = getStatusInfo(String(o.status || ""));
                      const itemsCount = Array.isArray(o.line_items) ? o.line_items.reduce((s: number, i: any) => s + i.quantity, 0) : 0;
                      return (
                        <div key={o.id} className="p-4 border rounded-xl bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700">#{o.id}</div>
                            <div>
                              <div className="font-semibold text-gray-900">Pedido #{o.id}</div>
                              <div className="text-sm text-gray-600">{new Date(o.date_created).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${s.bg} ${s.text} ${s.border} whitespace-nowrap flex-shrink-0`}>{s.label}</span>
                            <span className="text-sm text-gray-600 whitespace-nowrap flex-shrink-0">Itens: {itemsCount}</span>
                            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap flex-shrink-0">Total: {o.total}€</span>
                          </div>
                        </div>
                      );
                    })}
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

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageComponent />
    </Suspense>
  );
}