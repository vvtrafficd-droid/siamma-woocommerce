"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { PhoneInput } from "@/components/PhoneInput";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  postalcode: string;
  address: string;
  addressComplement?: string;
  city?: string;
  municipality?: string;
  district?: string;
  country: string;
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { register, handleSubmit, setValue, watch } = useForm<RegisterForm>({
    defaultValues: { country: "Portugal" },
  });
  const [loading, setLoading] = useState(false);



  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/customers/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || "Falha no registo");
      }
      const customer = payload.customer;
      login({ email: customer?.email, customerId: customer?.id, customer });
      router.push("/orders");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        links={[{ title: "Início", href: "/" }, { title: "Registo", href: "#" }]}
      />
      <section className="w-full bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Criar conta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Primeiro nome</Label>
                  <Input id="firstName" placeholder="João" {...register("firstName", { required: true })} />
                </div>
                <div>
                  <Label htmlFor="lastName">Apelido</Label>
                  <Input id="lastName" placeholder="Silva" {...register("lastName", { required: true })} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="joao@email.com" {...register("email", { required: true })} />
                </div>


                <div className="sm:col-span-2 text-sm text-gray-600">
                  <Label htmlFor="zip">Código Postal</Label>

                  <Input id="postalcode" placeholder="XXXX-XXX" {...register("postalcode", { required: true })} />

                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" placeholder="N.º, Rua, Localidade" {...register("address", { required: true })} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="addressComplement">Complemento (opcional)</Label>
                  <Input id="addressComplement" placeholder="Andar, apartamento" {...register("addressComplement")} />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" readOnly placeholder="Selecionado pelo código postal" {...register("city")} />
                </div>
                <div>
                  <Label htmlFor="municipality">Concelho</Label>
                  <Input id="municipality" readOnly placeholder="Selecionado pelo código postal" {...register("municipality")} />
                </div>
                <div>
                  <Label htmlFor="district">Distrito</Label>
                  <Input id="district" readOnly placeholder="Selecionado pelo código postal" {...register("district")} />
                </div>
                <input type="hidden" {...register("country")} value="Portugal" />
                <div className="sm:col-span-2">
                  <Label htmlFor="phone">Telemóvel</Label>
                  <PhoneInput
                    id="phone"
                    value={watch("phone") || ""}
                    onChange={(v) => setValue("phone", v, { shouldValidate: true })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full bg-green-600 text-white py-6 text-lg" disabled={loading}>
                    {loading ? "A criar conta..." : "Registar"}
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