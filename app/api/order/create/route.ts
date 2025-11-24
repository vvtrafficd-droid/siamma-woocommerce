import { NextRequest, NextResponse } from "next/server";
import { wcApi } from "@/lib/woocommerce";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      address,
      country,
      city, // city is now directly provided
      phone,
      paymentMethod,
      items,
      total,
      shipping,
      fulfillment,
    } = body;

    // The geocoding and distance check logic is removed.
    // The frontend now controls which cities are allowed.

    // Check if customer exists
    let customerId = 0;
    try {
      const { data: existingCustomers } = await wcApi.get("customers", {
        email: email,
      });
      if (existingCustomers.length > 0) {
        customerId = existingCustomers[0].id;
      } else {
        // Create a new customer
        const { data: newCustomer } = await wcApi.post("customers", {
          email: email,
          first_name: firstName,
          last_name: lastName,
          billing: {
            first_name: firstName,
            last_name: lastName,
            address_1: address,
            city: city,
            country: country,
            email: email,
            phone: phone,
          },
          shipping: {
            first_name: firstName,
            last_name: lastName,
            address_1: address,
            city: city,
            country: country,
          },
        });
        customerId = newCustomer.id;
      }
    } catch (error: any) {
      // Don't block order creation if customer creation fails
      console.error("Customer creation/lookup error:", error.response?.data || error.message);
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
      customer_id: customerId,
      billing: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        state: "", // District is no longer available
        postcode: "", // Postal code is no longer used
        country,
        email,
        phone,
      },
      shipping: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city: city,
        state: "", // District is no longer available
        postcode: "", // Postal code is no longer used
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
