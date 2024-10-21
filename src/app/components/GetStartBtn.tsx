"use client";
import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ChevronRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const GetStartBtn = () => {
  const ref = useRef(null);
  const inView = useInView(ref);
  console.log(inView);
  return (
    <>
      <div ref={ref}>
        <Link href="/playground">
          <RainbowButton className="group mx-auto mt-12 flex items-center gap-2 pr-6">
            Get Started{" "}
            <ChevronRight className="transition-all duration-300 group-hover:translate-x-2" />
          </RainbowButton>
        </Link>
      </div>
      <Link href="/playground">
        <RainbowButton
          className={`group fixed right-28 top-4 flex items-center gap-2 pr-6 transition-all duration-200 ${inView ? "scale-0 opacity-0" : "scale-100opacity-100"}`}
        >
          Get Started{" "}
          <ChevronRight className="transition-all duration-300 group-hover:translate-x-2" />
        </RainbowButton>
      </Link>
    </>
  );
};

export default GetStartBtn;
