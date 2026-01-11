"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/newHomepic1.jpg',
    '/newHomepic2.jpg',
    '/newHomepic3.jpg',
    '/newHomepic4.jpg',  // Your new photo
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);  // Changed from 3 to 4
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 4) % 4);  // Changed from 3 to 4
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 4);  // Changed from 3 to 4
  };

  return (
    <div className="w-full max-w-[350px] @[1200]:max-w-[450px] @[1400]:max-w-[550px] p-5">
      <div className="relative group">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-2xl p-1">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-square">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={slide}
                      alt={`Slide ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={previousSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-orange-500 w-7'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-3 border-l-3 border-orange-500 rounded-tl-lg z-20"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-3 border-r-3 border-orange-500 rounded-br-lg z-20"></div>
      </div>
    </div>
  );
}