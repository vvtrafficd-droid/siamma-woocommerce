import { WooProduct } from "@/types/woo";
import { wcApi } from "./woocommerce";

export async function getNewArrivals(count: number): Promise<WooProduct[]> {
  return await wcApi.get(`products?orderby=date&order=desc&per_page=${count}`)
    .then((res) => res.data as WooProduct[])
    .catch((err) => {
      console.error("Error fetching top sellings:", err);
      return [];
    });
}

export async function getBestSellings(count: number): Promise<WooProduct[]> {
  return await wcApi.get(`products?orderby=popularity&order=desc&per_page=${count}`)
    .then((res) => res.data as WooProduct[])
    .catch((err) => {
      console.error("Error fetching top sellings:", err);
      return [];
    });
}
export async function getTopSellings(count: number): Promise<WooProduct[]> {
  return await wcApi
    .get(`products?orderby=sales&order=desc&per_page=${count}`)
    .then((res) => res.data as WooProduct[])
    .catch((err) => {
      console.error("Error fetching top sellings:", err);
      return [];
    });
}