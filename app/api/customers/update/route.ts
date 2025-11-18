import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      email,
      firstName,
      lastName,
      phone,
      address,
      addressComplement,
      city,
      municipality,
      district,
      zip,
      country,
    } = body;

    let id = customerId;
    if (!id && email) {
      const { data } = await wcApi.get("customers", { search: email });
      const found = Array.isArray(data) ? data.find((c: any) => c?.email?.toLowerCase() === String(email).toLowerCase()) : null;
      id = found?.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
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

    const { data } = await wcApi.put(`customers/${id}`, payload);
    return NextResponse.json({ customer: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Falha ao atualizar cliente", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}