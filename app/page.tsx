import ShopPage from "./(pages)/shop/ShopPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Loading...</div>}>
      <ShopPage />
    </Suspense>
  );
}
