"use client";
import React from "react";
import { useCartStore}  from "@/store/cartStore";
import  toast  from "react-hot-toast";

const AddToCartVariation = ({product,variation}:{product:any,variation:any}) => {
  const {addToCart} = useCartStore();

  console.log(variation);
  const handleAdd = () => {
    addToCart({
      id: variation.id,
      name: product.name,
      slug: product.slug,
      price: variation.price,
      regular_price: variation.regular_price,
      sale_price: variation.sale_price,
      images: variation?.image?.src || "",
      type:"variable",
      parentId: variation.parent_id,
      variationName: variation.name
    });
    
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <button
      onClick={handleAdd}
      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
    >
    <i className="ri-shopping-cart-line mr-2"></i> Adicionar ao carrinho
    </button>
  );
};

export default AddToCartVariation;
