import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Send review to WooCommerce
    const response = await wcApi.post("products/reviews", body);

    // Return success response
    return NextResponse.json({
      message: "Review submitted successfully",
      review: response.data,
    });
  } catch (error: any) {
    console.error("Error submitting review:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to submit review",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
