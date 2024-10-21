"use client";

import React, { forwardRef, useRef } from "react";
import Prisma from "@/images/prisma.svg";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { CodeXml } from "lucide-react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-20 items-center justify-center rounded-full border-2 bg-background p-5 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const Linting = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex-col/3 absolute left-[50%] top-1/3 flex w-[60%] max-w-[500px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-transparent p-10 opacity-50 transition-all duration-500 group-hover:left-[60%] group-hover:opacity-100"
      ref={containerRef}
    >
      <div className="relative flex size-full flex-row justify-between text-primary">
        <div className="absolute right-full top-1/2 -translate-x-5 -translate-y-1/2 text-center text-4xl font-black opacity-0 transition-all duration-500 group-hover:opacity-100">
          Prisma Linter
        </div>
        <Circle ref={div1Ref}>
          <Prisma />
        </Circle>
        <Circle ref={div2Ref}>
          <CodeXml className="size-full stroke-2" />
        </Circle>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={10}
        endYOffset={10}
        curvature={-20}
        pathWidth={4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
        startYOffset={-10}
        endYOffset={-10}
        curvature={20}
        pathWidth={4}
        reverse
      />
    </div>
  );
};

export default Linting;
