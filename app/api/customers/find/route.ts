import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    const { data } = await wcApi.get("customers", { search: email });
    const customer = Array.isArray(data) ? data.find((c: any) => c?.email?.toLowerCase() === email.toLowerCase()) : null;

    if (!customer) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Falha a procurar cliente", details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}