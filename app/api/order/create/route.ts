import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

async function geocode(query: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  const first = data[0];
  const lat = parseFloat(first.lat);
  const lon = parseFloat(first.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const c = 2 * Math.asin(
    Math.sqrt(
      sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
    )
  );
  return R * c;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      address,
      country,
      zip,
      phone,
      paymentMethod,
      items,
      total,
      shipping,
    } = body;

    const originQuery = "4835-517 Nespereira, Portugal";
    const destQuery = `${zip} Portugal`;
    const origin = await geocode(originQuery);
    const dest = await geocode(destQuery);
    if (!origin || !dest) {
      return NextResponse.json(
        { error: "Não foi possível localizar o código postal" },
        { status: 400 }
      );
    }
    const distanceKm = Math.round(haversineKm(origin, dest));
    if (distanceKm > 50) {
      return NextResponse.json(
        { error: "Fora da zona de entrega", distanceKm },
        { status: 400 }
      );
    }

    // Map cart items to WooCommerce order line_items
    const line_items = items.map((item: any) => ({
      product_id: +item.product_id,
      variation_id: +item.variation_id,
      quantity: item.quantity,
    }));

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title:
        paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod,
      set_paid: false,
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: body.city || body.municipality || "",
        state: body.district || "",
        postcode: zip,
        country,
        email,
        phone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: body.city || body.municipality || "",
        state: body.district || "",
        postcode: zip,
        country,
      },
      line_items,
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: shipping,
        },
      ],
    };

    const { data } = await wcApi.post("orders", orderData);

    return NextResponse.json(
      { message: "Order Created Successfully", order: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("WooCommerce Order Error:", error.response?.data || error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
