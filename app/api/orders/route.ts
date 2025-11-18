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
    };

    if (customerId) params.customer = customerId;
    else if (email) params.search = email;
    else {
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