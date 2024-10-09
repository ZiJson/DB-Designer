import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { GripHorizontal, Maximize2 } from "lucide-react";
import Draggable from "../../dnd/Draggable";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";
import { Coordinates } from "@dnd-kit/core/dist/types";

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
  padding = 32,
}: Props) => {
  const [widgetSide, setWidgetSide] = useState(side);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShowToolbar, setIsShowToolbar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosition = useRef<Coordinates>({ x: 0, y: 0 });
  const [position, setPosition] = useState<Coordinates | null>({
    x: padding,
    y: -2000,
  });

  const getSidePosition = useCallback(
    (side: "left" | "right"): Coordinates => {
      if (!containerRef.current) return { x: 0, y: 0 };
      switch (side) {
        case "left":
          return {
            x: padding,
            y: window.innerHeight - containerRef.current.offsetHeight - padding,
          };
        case "right":
          return {
            x: window.innerWidth - containerRef.current.offsetWidth - padding,
            y: window.innerHeight - containerRef.current.offsetHeight - padding,
          };
      }
    },
    [padding],
  );

  useEffect(() => {
    setPosition(getSidePosition(widgetSide));
  }, [getSidePosition, widgetSide]);
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.id !== widgetId || !position) return;
    startPosition.current = position;
  };

  const { isDragging } = useDraggable({
    id: widgetId,
  });

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
    if (event.active.id !== widgetId) return;
    const { x, y } = event.delta;
    setPosition({
      x: startPosition.current.x + x,
      y: startPosition.current.y + y,
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== widgetId) return;
    const { x: deltaX, y: deltaY } = event.delta;
    const { x, y } = event.activatorEvent as MouseEvent;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (windowWidth / 2 < x + deltaX) {
      setPosition(getSidePosition("right"));
    } else {
      setPosition(getSidePosition("left"));
    }
  };

  const positionStyle = position && {
    top: position.y,
    left: position.x,
  };

  console.log(position);

  return (
    <Draggable
      draggableId={widgetId}
      className={`absolute z-10 rounded-lg ${className} transition-[top,transform,right,left,bottom]`}
      style={{ ...positionStyle }}
      isTransform={false}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <Card
        className={`no-scrollbar w-[40rem] overflow-auto shadow-2xl ${isExpanded ? "h-[60rem]" : "h-72"}`}
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
        className={`absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 rounded-b-xl bg-primary/50 transition-all duration-200 ${isShowToolbar ? "h-[calc(100%_+_2rem)] w-[calc(100%_+_1rem)]" : "h-full w-full"}`}
        onMouseLeave={() => setIsShowToolbar(isDragging)}
      >
        <Button
          className="absolute left-[0.5rem] top-1 h-6 w-8 text-primary"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => setIsExpanded((pre) => !pre)}
        >
          <Maximize2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
        </Button>
        <GripHorizontal className="absolute left-1/2 top-1 -translate-x-1/2 text-primary" />
      </Card>
    </Draggable>
  );
};

export default Widget;
