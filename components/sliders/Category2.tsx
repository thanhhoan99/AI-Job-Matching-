"use client";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const data = [
  { img: "img-big1.png", title: "Software", count: 55 },
  { img: "img-big2.png", title: "Finance", count: 35 },
  { img: "img-big3.png", title: "Recruiting", count: 20 },
  { img: "img-big1.png", title: "Management", count: 15 },
  { img: "img-big2.png", title: "Advertising", count: 10 },
  { img: "img-big3.png", title: "Marketing", count: 12 },
];

export default function CategorySlider2() {
  return (
    <div className="relative w-full overflow-hidden px-4">
      <Swiper
        slidesPerView={6}
        spaceBetween={30}
        loop={true}
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          575: { slidesPerView: 2 },
          767: { slidesPerView: 2 },
          991: { slidesPerView: 3 },
          1199: { slidesPerView: 6 },
        }}
        className="pb-16 pt-5"
      >
        {data.map((item, i) => (
          <SwiperSlide key={i}>
            <div
              className="card-grid-5 card-category hover-up rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `url(/assets/imgs/page/homepage2/${item.img})`,
              }}
            >
              <Link href="/jobs-grid" className="block">
                <div className="flex h-48 w-full items-end justify-start p-4 bg-black/40 rounded-xl">
                  <div>
                    <h6 className="text-white mb-1 font-semibold">{item.title}</h6>
                    <p className="text-white text-sm">
                      {item.count} Jobs Available
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng */}
      <div className="swiper-button-next !right-2 !top-1/2 !-translate-y-1/2" />
      <div className="swiper-button-prev !left-2 !top-1/2 !-translate-y-1/2" />
    </div>
  );
}
