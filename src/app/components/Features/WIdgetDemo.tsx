"use client";
import { useState, useCallback } from "react";
import { throttle } from "lodash";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripHorizontal, Minimize2, Minus } from "lucide-react";

const WidgetDemo = () => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // 節流處理 mouse move 事件
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect();
      setPosition({
        top: e.clientY - rect.top,
        left: e.clientX - rect.left,
      });
    }, // 節流時間（毫秒）
    [],
  );

  return (
    <div
      className="absolute h-full w-full cursor-grabbing [mask-image:linear-gradient(to_top,transparent_20%,#000_90%)]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition(null)}
    >
      <div
        className={`absolute h-[7.5rem] w-[12rem] -translate-x-1/2 translate-y-3 duration-300 ease-out group-hover:h-[12rem] ${position ? "transition-[height]" : "transition-all"}`}
        style={position || { top: "calc(25%)", left: "calc(50%)" }}
      >
        <Card className={`no-scrollbar h-full w-full overflow-auto shadow-2xl`}>
          <div className="h-full w-full"></div>
        </Card>
        <Card
          className={`absolute bottom-0 left-1/2 -z-10 h-[calc(100%_+_2rem)] w-[calc(100%_+_1rem)] -translate-x-1/2 rounded-b-xl bg-primary/50 text-primary-foreground/70 transition-all duration-200`}
        >
          <Button
            className="absolute left-[0.5rem] top-1 h-6 w-8"
            variant="ghost"
            size="icon"
          >
            <Minimize2
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
              strokeWidth={3}
            />
          </Button>
          <Button
            className="absolute right-[0.5rem] top-1 h-6 w-8"
            variant="ghost"
            size="icon"
            aria-label="hide"
          >
            <Minus
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
              strokeWidth={3}
            />
          </Button>
          <GripHorizontal className="absolute left-1/2 top-1 -translate-x-1/2" />
        </Card>
      </div>
    </div>
  );
};

export default WidgetDemo;
