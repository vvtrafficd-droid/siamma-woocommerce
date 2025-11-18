import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const email = searchParams.get("email");

    const params: Record<string, any> = {
      per_page: 10,
      orderby: "date",
      order: "desc",
      status: "any",
    };

    if (customerId) {
      params.customer = customerId;
    } else if (email) {
      try {
        const resp = await wcApi.get("customers", { search: email });
        const list = resp.data as any[];
        const match = Array.isArray(list)
          ? list.find((c: any) => c?.email?.toLowerCase() === String(email).toLowerCase())
          : null;
        if (match?.id) {
          params.customer = match.id;
        } else {
          return NextResponse.json({ orders: [] }, { status: 200 });
        }
      } catch (e) {
        return NextResponse.json({ orders: [] }, { status: 200 });
      }
    } else {
      return NextResponse.json({ error: "Informe customerId ou email" }, { status: 400 });
    }

    const { data } = await wcApi.get("orders", params);

    return NextResponse.json({ orders: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Falha ao buscar pedidos", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}