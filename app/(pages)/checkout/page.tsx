"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";
import { Truck, Store } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  nif?: string;
  address: string;
  addressComplement?: string;
  country: string;
  city: string;
  phone: string;
  paymentMethod: string;
  fulfillment: "pickup" | "delivery";
  pickupDate?: string;
  pickupTime?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const deliveryCities = [
  "Guimarães",
  "Braga",
  "Vila Nova de Famalicão",
  "Fafe",
  "Felgueiras",
  "Vizela",
  "Santo Tirso",
  "Póvoa de Lanhoso",
  "Barcelos",
  "Paços de Ferreira",
  "Lousada",
  "Trofa",
  "Amarante",
  "Vila do Conde",
  "Póvoa de Varzim",
  "Maia",
  "Valongo",
  "Paredes",
  "Penafiel",
  "Porto",
  "Vila Real",
  "Celorico de Basto",
  "Cabeceiras de Basto",
  "Esposende",
  "Vieira do Minho",
  "Amares",
  "Vila Verde",
  "Terras de Bouro",
  "Ponte de Lima",
  "Viana do Castelo",
  "Matosinhos",
  "Gondomar",
  "Vila Nova de Gaia",
  "Mondim de Basto",
  "Ribeira de Pena"
];

const CheckoutPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      paymentMethod: "cod",
      country: "Portugal",
      fulfillment: "delivery",
      city: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customerPrefilled, setCustomerPrefilled] = useState<boolean>(false);

  const { items, clearCart } = useCartStore();
  const orderItems = items;

  const subtotal = orderItems.reduce(
    (sum, item) => sum + +item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  React.useEffect(() => {
    const email = watch("email");
    if (!email || email.length < 5) {
      setCustomerPrefilled(false);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${baseUrl}/api/customers/find?email=${encodeURIComponent(email)}`, { signal: controller.signal });
        if (!res.ok) {
          setCustomerPrefilled(false);
          return;
        }
        const data = await res.json();
        const c = data.customer || {};
        const b = c.billing || {};
        const s = c.shipping || {};
        setValue("firstName", b.first_name || c.first_name || "", { shouldValidate: true });
        setValue("lastName", b.last_name || c.last_name || "", { shouldValidate: true });
        setValue("address", b.address_1 || s.address_1 || "", { shouldValidate: true });
        setValue("addressComplement", b.address_2 || "", { shouldValidate: true });

        const fetchedCity = b.city || s.city || "";
        if (deliveryCities.includes(fetchedCity)) {
          setValue("city", fetchedCity, { shouldValidate: true });
        }

        setValue("country", b.country || s.country || "Portugal", { shouldValidate: true });
        setValue("phone", b.phone || "", { shouldValidate: true });
        setCustomerPrefilled(true);
      } catch {
        setCustomerPrefilled(false);
      }
    }, 600);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [watch("email")]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (data.fulfillment === "delivery" && !data.city) {
      alert("Por favor, selecione uma cidade para a entrega.");
      return;
    }
    if (data.fulfillment === "pickup" && (!data.pickupDate || !data.pickupTime)) {
      alert("Por favor, selecione a data e hora para o levantamento.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...data,
        items: orderItems.map((item) => {
          const isVariation = item.type === "variable";
          return {
            product_id: isVariation ? item.parentId : item.id,
            variation_id: isVariation && item.id,
            quantity: item.quantity,
          }
        }),
        totals: {
          subtotal,
          shipping,
          total,
        },
      };

      const res = await fetch(`${baseUrl}/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const { order } = await res.json();

      setSuccess(true);
      clearCart();
      reset();
      router.push(`/orders?email=${data.email}&newOrder=true`);
    } catch (err) {
      console.error("Order error:", err);
      alert("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        links={[
          { title: 'Início', href: '/' },
          { title: 'Finalizar compra', href: '#' },
        ]} />
      <section className="checkout w-full bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8"
          >
            {/* Left: Billing Details */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes de envio</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Primeiro nome</Label>
                    <Input
                      id="firstName"
                      placeholder="João"
                      className={cn(errors.firstName && "border-red-500")}
                      {...register("firstName", { required: "Primeiro nome é obrigatório" })}
                    />
                    {errors.firstName && (
                      <div className="mt-1 text-xs text-red-600">{String(errors.firstName.message)}</div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apelido</Label>
                    <Input
                      id="lastName"
                      placeholder="Silva"
                      className={cn(errors.lastName && "border-red-500")}
                      {...register("lastName", { required: "Apelido é obrigatório" })}
                    />
                    {errors.lastName && (
                      <div className="mt-1 text-xs text-red-600">{String(errors.lastName.message)}</div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="nif">Nº de Contribuinte (NIF)</Label>
                    <Input
                      id="nif"
                      placeholder="123456789"
                      {...register("nif")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="email">Endereço de email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@exemplo.com"
                      className={cn(errors.email && "border-red-500")}
                      {...register("email", {
                        required: "Email é obrigatório",
                        pattern: { value: /.+@.+\..+/, message: "Email inválido" },
                      })}
                    />
                    {customerPrefilled && (
                      <div className="mt-1 text-xs text-green-600">Dados do cliente carregados</div>
                    )}
                    {errors.email && (
                      <div className="mt-1 text-xs text-red-600">{String(errors.email.message)}</div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Forma de entrega</Label>
                    <RadioGroup
                      defaultValue={watch("fulfillment")}
                      onValueChange={(v) => setValue("fulfillment", v as "pickup" | "delivery", { shouldValidate: true })}
                      className="mt-2 grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                        <Label
                          htmlFor="pickup"
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition",
                            "text-base md:text-lg",
                            watch("fulfillment") === "pickup"
                              ? "border-green-600 bg-green-50 ring-2 ring-green-600"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          )}
                        >
                          <Store className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="font-semibold">Levantamento</span>
                            <span className="text-xs text-muted-foreground">Levantamento no local</span>
                          </div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                        <Label
                          htmlFor="delivery"
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition",
                            "text-base md:text-lg",
                            watch("fulfillment") === "delivery"
                              ? "border-green-600 bg-green-50 ring-2 ring-green-600"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          )}
                        >
                          <Truck className="w-5 h-5 text-green-600" />
                          <div className="flex flex-col">
                            <span className="font-semibold">Entrega</span>
                            <span className="text-xs text-muted-foreground">Entrega no endereço</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {watch("fulfillment") === "pickup" && (
                    <div className="sm:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Morada para levantamento:</h4>
                        <p className="text-sm text-gray-600">N105 1449, 4835-517 Nespereira, Portugal</p>
                        <p className="text-xs text-gray-500 mt-1">Horário: Seg-Sex 8:00-12:00 e 13:00-17:00</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pickupDate">Data</Label>
                          <Input
                            id="pickupDate"
                            type="date"
                            {...register("pickupDate", { required: watch("fulfillment") === "pickup" ? "Data de levantamento é obrigatória" : false })}
                          />
                          {errors.pickupDate && (
                            <div className="mt-1 text-xs text-red-600">{String(errors.pickupDate.message)}</div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="pickupTime">Hora</Label>
                          <Input
                            id="pickupTime"
                            type="time"
                            {...register("pickupTime", { required: watch("fulfillment") === "pickup" ? "Hora de levantamento é obrigatória" : false })}
                          />
                          {errors.pickupTime && (
                            <div className="mt-1 text-xs text-red-600">{String(errors.pickupTime.message)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {watch("fulfillment") === "delivery" && (
                    <>
                      <div className="sm:col-span-2">
                        <Label htmlFor="city">Cidade (Entregamos nessas cidades)</Label>
                        <Controller
                          name="city"
                          control={control}
                          rules={{ required: watch("fulfillment") === "delivery" ? "Cidade é obrigatória para entrega" : false }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Escolha sua cidade" />
                              </SelectTrigger>
                              <SelectContent className="bg-white max-h-60">
                                {deliveryCities.map((city) => (
                                  <SelectItem key={city} value={city} className="text-sm">
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.city && (
                          <div className="mt-1 text-xs text-red-600">{String(errors.city.message)}</div>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="address">Morada</Label>
                        <Input
                          id="address"
                          placeholder="N.º, Rua, Localidade"
                          className={cn(errors.address && "border-red-500")}
                          {...register("address", { required: watch("fulfillment") === "delivery" ? "Morada é obrigatória para entrega" : false })}
                        />
                        {errors.address && (
                          <div className="mt-1 text-xs text-red-600">{String(errors.address.message)}</div>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <Label htmlFor="addressComplement">Complemento do endereço (opcional)</Label>
                        <Input
                          id="addressComplement"
                          placeholder="Andar, apartamento, etc."
                          {...register("addressComplement")}
                        />
                      </div>
                    </>
                  )}

                  <input
                    type="hidden"
                    {...register("country")}
                    value="Portugal"
                  />
                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Telemóvel</Label>
                    <PhoneInput
                      id="phone"
                      value={watch("phone") || ""}
                      onChange={(v) => setValue("phone", v, { shouldValidate: true })}
                    />
                    <input type="hidden" {...register("phone", { required: "Telemóvel é obrigatório" })} />
                    {errors.phone && (
                      <div className="mt-1 text-xs text-red-600">{String(errors.phone.message)}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="font-medium">Pagamento na entrega</span>
                    </div>
                    <span className="text-xs text-muted-foreground">fixo</span>
                  </div>
                  <input type="hidden" value="cod" {...register("paymentMethod")} />
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <Card className="lg:col-span-2 h-fit">
              <CardHeader>
                <CardTitle>A sua encomenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex w-full justify-between px-2 py-4 border-b border-gray-200 font-medium text-lg">
                  <p>Produtos</p>
                  <p>Subtotal</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center px-2 py-2 text-sm border-b border-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type === "variable" && item.variationName}</p>
                      </div>
                      <div className="ml-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">x{item.quantity}</span>
                        <span className="text-sm">
                          {siteConfig.currency} {(+item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-md px-2 py-4 font-medium border-b border-gray-200">
                  <span>Subtotal</span>
                  <span>
                    {siteConfig.currency} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-md px-2 py-4 font-medium border-b border-gray-200">
                  <span>Envio</span>
                  <span>
                    {siteConfig.currency} {shipping.toFixed(2)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg px-2 py-4 font-bold border-b border-gray-200">
                  <span>Total</span>
                  <span>
                    {siteConfig.currency} {total.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer mt-6 bg-green-600 text-white py-6 text-lg hover:bg-green-500"
                  disabled={
                    loading ||
                    orderItems.length === 0 ||
                    (watch("fulfillment") === "delivery" && !watch("city")) ||
                    (watch("fulfillment") === "pickup" && (!watch("pickupDate") || !watch("pickupTime")))
                  }
                >
                  {loading ? "A processar encomenda..." : "Finalizar encomenda"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;
