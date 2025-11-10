"use client";

import React from "react";
import Link from "next/link";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const data = [
  { icon: "marketing.svg", title: "Marketing & Sale", count: 1526 },
  { icon: "customer.svg", title: "Customer Help", count: 185 },
  { icon: "finance.svg", title: "Finance", count: 168 },
  { icon: "lightning.svg", title: "Software", count: 1856 },
  { icon: "human.svg", title: "Human Resource", count: 165 },
  { icon: "management.svg", title: "Management", count: 965 },
  { icon: "retail.svg", title: "Retail & Products", count: 563 },
  { icon: "security.svg", title: "Security Analyst", count: 254 },
  { icon: "content.svg", title: "Content Writer", count: 142 },
  { icon: "research.svg", title: "Market Research", count: 532 },
];

const CategorySlider = () => {
  return (
    <div className="relative w-full overflow-hidden px-4">
      <Swiper
        slidesPerView={5}
        spaceBetween={30}
        loop={true}
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        autoplay={{
          delay: 2500, // thời gian giữa các slide (ms)
          disableOnInteraction: false, // vẫn chạy sau khi user tương tác
        }}
        speed={800} // tốc độ chuyển slide (ms)
        breakpoints={{
          320: { slidesPerView: 1 },
          575: { slidesPerView: 2 },
          767: { slidesPerView: 2 },
          991: { slidesPerView: 3 },
          1199: { slidesPerView: 5 },
        }}
        className="pb-16 pt-5"
      >
        {data.map((item, i) => (
          <SwiperSlide key={i}>
            <Link href="/jobs-list">
              <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50">
                  <img
                    alt={item.title}
                    src={`/assets/imgs/page/homepage1/${item.icon}`}
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {item.count} <span>Jobs Available</span>
                  </p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng */}
      <div className="swiper-button-prev !left-1 !top-1/2 !-translate-y-1/2" />
      <div className="swiper-button-next !right-1 !top-1/2 !-translate-y-1/2" />
    </div>
  );
};

export default CategorySlider;
