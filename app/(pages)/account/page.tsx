"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

type AccountForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  zip?: string;
  address?: string;
  addressComplement?: string;
  city?: string;
  municipality?: string;
  district?: string;
  country?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function AccountPage() {
  const router = useRouter();
  const { email, customer, customerId, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const defaults: AccountForm = useMemo(() => {
    const billing = customer?.billing || {};
    return {
      firstName: customer?.first_name || billing?.first_name || "",
      lastName: customer?.last_name || billing?.last_name || "",
      email: customer?.email || email || "",
      phone: billing?.phone || "",
      zip: billing?.postcode || "",
      address: billing?.address_1 || "",
      addressComplement: billing?.address_2 || "",
      city: customer?.city || billing?.city || "",
      municipality: customer?.municipality || "",
      district: billing?.state || "",
      country: billing?.country || "Portugal",
    };
  }, [customer, email]);

  const { register, handleSubmit, reset } = useForm<AccountForm>({
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const onSubmit = async (data: AccountForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const res = await fetch(`${baseUrl}/api/customers/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, customerId }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Falha ao atualizar dados");
      }
      const updated = payload.customer;
      login({ email: updated?.email, customerId: updated?.id, customer: updated });
      setSuccess("Dados atualizados com sucesso");
    } catch (e: any) {
      setError(e?.message || "Falha ao atualizar dados");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb links={[{ title: "Início", href: "/" }, { title: "Meus dados", href: "#" }]} />
      <section className="w-full bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Meus dados</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" {...register("firstName", { required: true })} />
                </div>
                <div>
                  <Label htmlFor="lastName">Apelido</Label>
                  <Input id="lastName" {...register("lastName", { required: true })} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} />
                </div>
                <div>
                  <Label htmlFor="phone">Telemóvel</Label>
                  <Input id="phone" {...register("phone")} />
                </div>
                <div>
                  <Label htmlFor="zip">Código Postal</Label>
                  <Input id="zip" {...register("zip")} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Morada</Label>
                  <Input id="address" {...register("address")} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="addressComplement">Complemento</Label>
                  <Input id="addressComplement" {...register("addressComplement")} />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...register("city")} />
                </div>
                <div>
                  <Label htmlFor="municipality">Município</Label>
                  <Input id="municipality" {...register("municipality")} />
                </div>
                <div>
                  <Label htmlFor="district">Distrito</Label>
                  <Input id="district" {...register("district")} />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input id="country" {...register("country")} />
                </div>
                {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
                {success && <p className="md:col-span-2 text-sm text-green-600">{success}</p>}
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-green-600 text-white py-6 text-lg" disabled={loading}>
                    {loading ? "A guardar..." : "Guardar alterações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}