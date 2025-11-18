"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      <i className="ri-checkbox-circle-line text-green-500 text-9xl"></i> 
      <h1 className="text-3xl font-bold mb-3">Encomenda realizada com sucesso!</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Obrigado pela sua compra. Recebemos a sua encomenda e está a ser
        processada. Irá receber um email de confirmação brevemente.
      </p>

      <Button
        className="bg-green-600 text-white hover:bg-green-500 px-8 py-6 text-lg"
        onClick={() => router.push("/")}
      >
        Voltar ao início
      </Button>
    </div>
  );
};

export default OrderSuccessPage;
