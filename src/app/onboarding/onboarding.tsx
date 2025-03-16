"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoGlobeOutline } from "react-icons/io5";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import { GoShieldLock } from "react-icons/go";
import { AiOutlineDollarCircle } from "react-icons/ai";

interface OnboardingSlide {
  title: string;
  description: string;
  image: string | React.ReactNode;
}

const slides: OnboardingSlide[] = [
  {
    title: "Welcome to Coin Crush",
    description: "Discover and invest in curated meme coins with ease.",
    image: <IoGlobeOutline className="text-primary-purple text-[80px]" />,
  },
  {
    title: "Swipe to Explore",
    description:
      "Swipe left to skip or right to like and invest in meme coins.",
    image: (
      <HiOutlineArrowsRightLeft className="text-primary-purple text-[80px]" />
    ),
  },
  {
    title: "Secure Wallet Connection",
    description: "Deposit Solana to get started securely.",
    image: <GoShieldLock className="text-primary-purple text-[80px]" />,
  },
  {
    title: "Low Fees & High Returns",
    description: "Enjoy low transaction fees and explore promising coins.",
    image: (
      <AiOutlineDollarCircle className="text-primary-purple text-[80px]" />
    ),
  },
];

export const Onboarding = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Just set localStorage and navigate
      if (typeof window !== "undefined") {
        localStorage.setItem("hasSeenOnboarding", "true");
      }
      router.push("/login");
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent">
      <div className="flex flex-1 flex-col items-center justify-start px-0">
        <div className="flex-1 flex flex-col items-center justify-center px-0">
          {/* Image */}
          <div className="w-24 mb-6">{slides[currentSlide].image}</div>

          {/* Title */}
          <h1 className="text-primary-white text-[32px] text-center mb-4 font-bold">
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-center font-amalta text-[20px] text-primary-white mb-12 max-w-xs">
            {slides[currentSlide].description}
          </p>
        </div>
        {/* Dots */}
        <div className="flex gap-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-primary-purple" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between px-4 mb-8">
        {currentSlide > 0 ? (
          <button
            onClick={handleBack}
            className="text-primary-purple font-semibold text-lg"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          className="text-primary-purple font-semibold text-lg"
        >
          {currentSlide === slides.length - 1 ? "Login" : "Next"}
        </button>
      </div>
    </div>
  );
};
