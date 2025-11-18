import { NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function GET() {
  try {
    const per_page = 100;
    let page = 1;
    const all: any[] = [];

    // Fetch all category pages, excluding ID 15
    // and including empty categories to match admin counts
    while (true) {
      const resp = await wcApi.get("products/categories", {
        per_page,
        page,
        exclude: [15],
        hide_empty: false,
      });
      const { data, headers } = resp;
      const totalPages = Number(headers["x-wp-totalpages"]) || 1;

      if (Array.isArray(data) && data.length > 0) {
        all.push(...data);
      }

      if (page >= totalPages) break;
      page += 1;
    }

    return NextResponse.json(all, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching categories:", error.response?.data || error.message);

    return NextResponse.json(
      {
        error: "Failed to fetch product categories",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
