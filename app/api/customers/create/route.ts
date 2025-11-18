import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      addressComplement,
      city,
      municipality,
      district,
      zip,
      country,
    } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    const payload: Record<string, any> = {
      email,
      first_name: firstName,
      last_name: lastName,
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address || "",
        address_2: addressComplement || "",
        city: city || municipality || "",
        state: district || "",
        postcode: zip || "",
        country: country || "Portugal",
        email,
        phone: phone || "",
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address || "",
        city: city || municipality || "",
        state: district || "",
        postcode: zip || "",
        country: country || "Portugal",
      },
    };

    try {
      const { data } = await wcApi.post("customers", payload);
      return NextResponse.json({ customer: data }, { status: 200 });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Erro";
      if (msg.toLowerCase().includes("exist") || msg.toLowerCase().includes("email")) {
        try {
          const { data } = await wcApi.get("customers", { search: email });
          if (Array.isArray(data) && data.length > 0) {
            return NextResponse.json({ customer: data[0], existing: true });
          }
        } catch {}
      }
      return NextResponse.json(
        { error: "Falha ao criar cliente", details: msg },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Pedido inválido", details: error.message },
      { status: 400 }
    );
  }
}