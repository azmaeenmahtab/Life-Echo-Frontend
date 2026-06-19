"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import c1 from "@/assets/carousel1.jpg"
import c2 from "@/assets/carousel2.jpg"
import c3 from "@/assets/carousel3.jpg"
import c4 from "@/assets/carousel4.jpg"

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "vivid",
    image: c1, 
    overlayClass: "from-purple-900/30 via-transparent to-transparent",
  },
  {
    id: 2,
    title: "petaled",
    image: c2,
    overlayClass: "from-amber-900/30 via-transparent to-transparent",
  },
  {
    id: 3,
    title: "bloom",
    image: c3,
    overlayClass: "from-teal-900/30 via-transparent to-transparent",
  },
  {
    id: 4,
    title: "bloom",
    image: c4,
    overlayClass: "from-teal-900/30 via-transparent to-transparent",
  },
  {
    id: 5,
    title: "bloom",
    image: c1,
    overlayClass: "from-teal-900/30 via-transparent to-transparent",
  },
  {
    id: 6,
    title: "bloom",
    image: c2,
    overlayClass: "from-teal-900/30 via-transparent to-transparent",
  },
  {
    id: 7,
    title: "bloom",
    image: c3,
    overlayClass: "from-teal-900/30 via-transparent to-transparent",
  },
];

export default function PremiumCarousel() {
  const [isMounted, setIsMounted] = useState(false);

  // CRITICAL INITIALIZATION FIX: 
  // Forces Swiper calculations to occur exclusively client-side once CSS layouts have completely painted.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Elegant fallback placeholder that perfectly mimics the layout skeleton dimensions during SSR load
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-18 flex items-center justify-center gap-6 opacity-0">
        <div className="w-1/4 aspect-4/5 rounded-[36px] bg-gray-200" />
        <div className="w-1/2 aspect-4/5 rounded-[36px] bg-gray-300 scale-110" />
        <div className="w-1/4 aspect-4/5 rounded-[36px] bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="w-full relative select-none overflow-hidden py-12">
      <div className="w-full max-w-4xl mx-auto px-4 relative overflow-visible">
        
        <Swiper
          modules={[EffectCoverflow, Pagination, Navigation]}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          initialSlide={1} // Defaults the center focused slide directly onto index 1 (petaled)
          slidesPerView={1.2} 
          breakpoints={{
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 1.8 }, // Slightly optimized ratio to guarantee no clipping on either side
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: -30, // Balanced offset to bring side items cleanly into frame
            depth: 160,
            modifier: 1,
            slideShadows: false,
          }}
          loop={true}
           pagination={{ 
            clickable: true,
            el: ".custom-swiper-pagination" 
          }}
          navigation={{
            nextEl: ".custom-swiper-next",
            prevEl: ".custom-swiper-prev",
          }}
          className="w-full overflow-visible! py-6"
        >
          {CAROUSEL_SLIDES.map((slide) => (
            <SwiperSlide 
              key={slide.id} 
              className="relative aspect-3/4 md:aspect-4/5 rounded-[36px] overflow-hidden bg-white shadow-lg transition-all duration-500"
            >
              {/* Slide Image Wrapper */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="(max-w-7xl) 50vw"
                  priority
                />
              </div>

              {/* Tint overlay */}
              <div className={`absolute inset-0 bg-linear-to-t ${slide.overlayClass}`} />

              {/* Typography overlay matching layout */}
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <h3 className="text-white text-4xl md:text-6xl lg:text-7xl font-normal tracking-wide opacity-90 drop-shadow-sm lowercase">
                  {slide.title}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Elements */}
        <button className="custom-swiper-prev absolute left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/70 transition-all shadow-md active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button className="custom-swiper-next absolute right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/70 transition-all shadow-md active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination Dot Bars */}
      <div className="custom-swiper-pagination flex justify-center items-center gap-2 mt-8" />
    </div>
  );
}