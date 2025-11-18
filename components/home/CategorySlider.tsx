"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { WooProductCategory } from "@/types/woo";
import Link from "next/link";

interface CategorySliderProps {
  categories: WooProductCategory[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
  const swiperRef = useRef<any>(null);

  return (
    <section className="container mx-auto px-6 py-6 md:py-8 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Os nossos catálogos</h2>

        <div className="flex gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="p-2 px-3 bg-white border-gray-200 border rounded-md hover:border-green-300 hover:bg-green-50 transition"
          >
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="p-2 px-3 bg-white border-gray-200 border rounded-md hover:border-green-300 hover:bg-green-50 transition"
          >
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        loop
        spaceBetween={12}
        slidesPerView={2}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
          1280: { slidesPerView: 8 },
        }}
      >
        {categories
          .filter((cat) => cat.id !== 15) // optional exclusion
          .map((cat) => (
            <SwiperSlide key={cat.id}>
              <Link href={`/shop?category=${cat.id}`} className="group bg-white border border-gray-200/80 rounded-md p-3 flex flex-col items-center justify-center transition-all duration-200 hover:border-green-300 hover:shadow-sm">
                {cat.image?.src ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-1 ring-gray-200 group-hover:ring-green-300">
                    <Image
                      src={cat.image.src}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center ring-1 ring-gray-200">
                    <i className="ri-image-2-line text-gray-400 text-2xl"></i>
                  </div>
                )}
                <p className="mt-2 text-gray-700 font-medium text-center text-sm truncate capitalize">
                  {cat.name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};

export default CategorySlider;
