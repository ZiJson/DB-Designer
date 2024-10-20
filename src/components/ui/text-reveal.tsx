"use client";

import { FC, ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
  width?: number;
  height?: number;
  children?: ReactNode;
  side?: "left" | "right";
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
  children,
  width,
  height,
  side = "left",
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("h-[18 0vh] relative z-0", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex max-w-7xl items-center bg-transparent py-[5rem]"
        }
        style={{ height: height || "100vh" }}
      >
        <div className="absolute left-1/2 top-0 h-screen w-full max-w-7xl -translate-x-1/2 p-5 lg:p-12">
          {children}
        </div>
        <p
          ref={targetRef}
          className={`${side === "left" ? "" : "ml-auto flex-row-reverse"} flex flex-wrap p-5 text-2xl font-bold text-black/20 dark:text-white/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl`}
          style={{ width: width || "100%" }}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: any;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-1 lg:mx-2.5">
      <span className={"absolute opacity-30"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-black dark:text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextRevealByWord;
