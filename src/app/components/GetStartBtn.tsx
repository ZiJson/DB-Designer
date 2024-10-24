"use client";
import Link from "next/link";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ChevronRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GetStartBtn = () => {
  const ref = useRef(null);
  // 初始 inView 設定為 true
  const [inView, setInView] = useState(true);
  // 使用 useInView 來監控元素的可見性
  const isInView = useInView(ref);

  useEffect(() => {
    // 設定 100 毫秒後的計時器
    const timeoutId = setTimeout(() => {
      // 只在 100 毫秒後更新 inView 的值
      setInView(isInView);
    }, 100); // 100毫秒後執行

    // 清除計時器以防止內存洩漏
    return () => clearTimeout(timeoutId);
  }, [isInView]); // 當 isInView 更新時觸發

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
          className={`group fixed right-28 top-4 z-50 flex items-center gap-2 pr-6 transition-all duration-200 ${
            inView ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          Get Started{" "}
          <ChevronRight className="transition-all duration-300 group-hover:translate-x-2" />
        </RainbowButton>
      </Link>
    </>
  );
};

export default GetStartBtn;
