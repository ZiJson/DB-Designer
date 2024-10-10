import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { GripHorizontal, Maximize2, Minimize2 } from "lucide-react";
import Draggable from "../../dnd/Draggable";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";

type Position = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

const WidgetRect = {
  width: 500,
  height: 260,
};

interface Props {
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  isExpanded?: boolean;
  widgetId?: string;
  padding?: number;
}
const Widget = ({
  children,
  className,
  side = "left",
  widgetId = "widget1",
  padding = 24,
}: Props) => {
  const [widgetSide, setWidgetSide] = useState(side);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShowToolbar, setIsShowToolbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosition = useRef<Position | null>(null);
  const [position, setPosition] = useState<Position>({
    top: window.innerHeight - WidgetRect.height - padding,
    left: padding,
    right: window.innerWidth - WidgetRect.width - padding,
    bottom: padding,
  });

  const getSidePosition = useCallback(
    (side: "left" | "right"): Position => {
      if (!containerRef.current) return position;
      const top = isExpanded
        ? padding + 30
        : window.innerHeight - padding - WidgetRect.height;
      switch (side) {
        case "left":
          return {
            top,
            left: padding,
            right: window.innerWidth - WidgetRect.width - padding,
            bottom: padding,
          };
        case "right":
          return {
            top,
            right: padding,
            left: window.innerWidth - WidgetRect.width - padding,
            bottom: padding,
          };
      }
    },
    [padding, isExpanded],
  );

  const { isDragging } = useDraggable({
    id: widgetId,
  });
  useEffect(() => {
    !isDragging && setPosition(getSidePosition(widgetSide));
  }, [widgetSide, getSidePosition, isExpanded, isDragging]);
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.id !== widgetId || !position) return;
    startPosition.current = position;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const { top } = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const offsetY = mouseY - top;
    const trigger = offsetY < 40;
    setIsShowToolbar(trigger);
  };

  const onDragMove = (event: DragMoveEvent) => {
    if (event.active.id !== widgetId || !startPosition.current) return;
    const { x, y } = event.delta;

    setPosition({
      top: startPosition.current.top + y,
      left: startPosition.current.left + x,
      right: startPosition.current.right - x,
      bottom: startPosition.current.bottom - y,
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== widgetId) return;
    const { x: deltaX, y: deltaY } = event.delta;
    const { x, y } = event.activatorEvent as MouseEvent;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (windowWidth / 2 < x + deltaX) {
      setWidgetSide("right");
    } else {
      setWidgetSide("left");
    }
  };

  return (
    <Draggable
      draggableId={widgetId}
      className={`fixed z-10 rounded-lg ${className} transition-[top,transform,right,left,bottom]`}
      style={{ ...position }}
      isTransform={false}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <Card
        className={`no-scrollbar h-full w-full overflow-auto shadow-2xl`}
        ref={containerRef}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseMove={onMouseMove}
      >
        {children}
      </Card>
      <Card
        className={`absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 rounded-b-xl bg-primary/50 text-primary-foreground/70 transition-all duration-200 ${isShowToolbar ? "h-[calc(100%_+_2rem)] w-[calc(100%_+_1rem)]" : "h-full w-full"}`}
        onMouseLeave={() => !isDragging && setIsShowToolbar(false)}
      >
        <Button
          className="absolute left-[0.5rem] top-1 h-6 w-8"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => setIsExpanded((pre) => !pre)}
        >
          {!isExpanded ? (
            <Maximize2
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
              strokeWidth={3}
            />
          ) : (
            <Minimize2
              className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
              strokeWidth={3}
            />
          )}
        </Button>
        <GripHorizontal className="absolute left-1/2 top-1 -translate-x-1/2" />
      </Card>
    </Draggable>
  );
};

export default Widget;
