"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { PostalCodeAutocomplete } from "@/components/PostalCodeAutocomplete";
import { PostalCodeInfo, isValidPostalCode } from "@/lib/postalCodes";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  addressComplement?: string;
  country: string;
  zip: string;
  city?: string;
  municipality?: string;
  district?: string;
  phone: string;
  paymentMethod: string;
  fulfillment: "pickup" | "delivery";
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CheckoutPage = () => {
  const router = useRouter();
  const { register, handleSubmit, reset, setValue, watch } = useForm<CheckoutFormData>({
    defaultValues: { 
      paymentMethod: "cod",
      country: "Portugal",
      fulfillment: "delivery"
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPostalCode, setSelectedPostalCode] = useState<PostalCodeInfo | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [deliveryEligible, setDeliveryEligible] = useState<boolean>(true);
  const [customerPrefilled, setCustomerPrefilled] = useState<boolean>(false);

  const { items, clearCart } = useCartStore();
  const orderItems = items;

  const subtotal = orderItems.reduce(
    (sum, item) => sum + +item.price * item.quantity,
    0
  );
  const shipping = 250;
  const total = subtotal + shipping;

  const handlePostalCodeSelect = (postalCode: PostalCodeInfo) => {
    setSelectedPostalCode(postalCode);
    setValue("city", postalCode.locality, { shouldValidate: true });
    setValue("municipality", postalCode.municipality, { shouldValidate: true });
    setValue("district", postalCode.district, { shouldValidate: true });
  };

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
        setValue("city", b.city || s.city || "", { shouldValidate: true });
        setValue("municipality", b.city || s.city || "", { shouldValidate: true });
        setValue("district", b.state || s.state || "", { shouldValidate: true });
        setValue("zip", b.postcode || s.postcode || "", { shouldValidate: true });
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

  React.useEffect(() => {
    const zip = watch("zip");
    const mode = watch("fulfillment");
    if (mode !== "delivery") {
      setDistanceKm(null);
      setDeliveryEligible(true);
      return;
    }
    const valid = zip && isValidPostalCode(zip);
    if (!valid) {
      setDistanceKm(null);
      setDeliveryEligible(true);
      return;
    }
    const controller = new AbortController();
    const check = async () => {
      try {
        const originQ = "4835-517 Nespereira, Portugal";
        const destQ = `${zip} Portugal`;
        const g = async (q: string) => {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`, { signal: controller.signal });
          if (!res.ok) return null;
          const data = await res.json();
          if (!Array.isArray(data) || data.length === 0) return null;
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
          return { lat, lon };
        };
        const a = await g(originQ);
        const b = await g(destQ);
        if (!a || !b) {
          setDistanceKm(null);
          setDeliveryEligible(false);
          return;
        }
        const toRad = (v: number) => (v * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(b.lat - a.lat);
        const dLon = toRad(b.lon - a.lon);
        const lat1 = toRad(a.lat);
        const lat2 = toRad(b.lat);
        const sinDLat = Math.sin(dLat / 2);
        const sinDLon = Math.sin(dLon / 2);
        const c = 2 * Math.asin(Math.sqrt(sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon));
        const km = R * c;
        const rounded = Math.round(km);
        setDistanceKm(rounded);
        setDeliveryEligible(rounded <= 50);
      } catch {
        setDeliveryEligible(true);
      }
    };
    check();
    return () => controller.abort();
  }, [watch("zip")]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (data.fulfillment === "delivery" && !isValidPostalCode(data.zip)) {
      alert("Por favor, insira um código postal válido no formato XXXX-XXX");
      return;
    }
    if (data.fulfillment === "delivery" && distanceKm !== null && distanceKm > 50) {
      alert("Endereço fora da zona de entrega (50km de 4835-517)");
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        ...data,
        items: orderItems.map((item) => {
          const isVariation =  item.type === "variable";
          return {
            product_id: isVariation ? item.parentId :item.id,
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

      setSuccess(true);
      clearCart();
      reset();
      router.push('/order-success');
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
                    {...register("firstName", { required: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apelido</Label>
                  <Input
                    id="lastName"
                    placeholder="Silva"
                    {...register("lastName", { required: true })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Endereço de email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@exemplo.com"
                    {...register("email", { required: true })}
                  />
                  {customerPrefilled && (
                    <div className="mt-1 text-xs text-green-600">Dados do cliente carregados</div>
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
                          <span className="font-semibold">Retirada</span>
                          <span className="text-xs text-muted-foreground">Retirar em ponto físico</span>
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

                {watch("fulfillment") === "delivery" && (
                  <>
                    <div>
                      <Label htmlFor="zip">Código Postal</Label>
                      <PostalCodeAutocomplete
                        value={watch("zip") || ""}
                        onChange={(value) => setValue("zip", value, { shouldValidate: true })}
                        onSelect={handlePostalCodeSelect}
                        placeholder="XXXX-XXX"
                      />
                      {selectedPostalCode && (
                        <div className="mt-1 text-xs text-green-600">
                          📍 {selectedPostalCode.locality}, {selectedPostalCode.municipality}
                        </div>
                      )}
                      {distanceKm !== null && (
                        <div className="mt-1 text-xs">
                          {deliveryEligible ? (
                            <span className="text-green-600">Dentro da zona de entrega (~{distanceKm} km)</span>
                          ) : (
                            <span className="text-red-600">Fora da zona de entrega (&gt;50 km, ~{distanceKm} km)</span>
                          )}
                        </div>
                      )}
                      {watch("zip") && !isValidPostalCode(watch("zip")) && (
                        <div className="mt-1 text-xs text-red-600">
                          Formato inválido. Use XXXX-XXX
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Morada</Label>
                      <Input
                        id="address"
                        placeholder="N.º, Rua, Localidade"
                        {...register("address", { required: watch("fulfillment") === "delivery" })}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label htmlFor="addressComplement">Complemento do endereço (opcional)</Label>
                      <Input
                        id="addressComplement"
                        placeholder="Andar, apartamento, etc."
                        {...register("addressComplement")}
                      />
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
                  </>
                )}
                
                <input
                  type="hidden"
                  {...register("country")}
                  value="Portugal"
                />
                <div className="sm:col-span-2">
                  <Label htmlFor="phone">Telemóvel</Label>
                  <Input
                    id="phone"
                    placeholder="+351 912 345 678"
                    {...register("phone", { required: true })}
                  />
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
                  (watch("fulfillment") === "delivery" && distanceKm !== null && distanceKm > 50) ||
                  (watch("fulfillment") === "delivery" && watch("zip") && !isValidPostalCode(watch("zip")))
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
