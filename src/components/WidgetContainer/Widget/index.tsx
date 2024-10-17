"use client";
import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button";
import { GripHorizontal, Maximize2, Minimize2, Minus } from "lucide-react";
import Draggable from "../../dnd/Draggable";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

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
  widgetId = "widget1",
  padding = 24,
}: Props) => {
  const { side, isExpanded, position, hide, isShowToolbar } = useWorkspaceStore(
    (state) => state.widgets[widgetId],
  );
  const setWidgetSide = useWorkspaceStore((state) => state.setWidgetSide);
  const toggletIsExpanded = useWorkspaceStore(
    (state) => state.toggletIsExpanded,
  );
  const setWidgetPosition = useWorkspaceStore(
    (state) => state.setWidgetPosition,
  );
  const setIsShowToolbar = useWorkspaceStore((state) => state.setIsShowToolbar);
  const toggleWidgetHide = useWorkspaceStore((state) => state.toggleWidgetHide);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const startPosition = useRef<Position | null>(null);

  const getSidePosition = useCallback((): Position | null => {
    if (!containerRef.current || !windowWidth || !windowHeight) return null;
    if (hide)
      return {
        top: padding,
        left: windowWidth / 2,
        right: windowWidth / 2,
        bottom: windowHeight - padding - 40,
      };

    const top = isExpanded
      ? padding + 30
      : windowHeight - padding - WidgetRect.height;
    switch (side) {
      case "left":
        return {
          top,
          left: padding,
          right: windowWidth - WidgetRect.width - padding,
          bottom: padding,
        };
      case "right":
        return {
          top,
          right: padding,
          left: windowWidth - WidgetRect.width - padding,
          bottom: padding,
        };
    }
  }, [padding, side, isExpanded, windowWidth, windowHeight, hide]);

  const { isDragging } = useDraggable({
    id: widgetId,
  });
  useEffect(() => {
    !isDragging && setWidgetPosition(widgetId, getSidePosition());
  }, [
    side,
    getSidePosition,
    isExpanded,
    isDragging,
    setWidgetPosition,
    widgetId,
  ]);
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
    setIsShowToolbar(widgetId, trigger);
  };

  const onDragMove = (event: DragMoveEvent) => {
    if (event.active.id !== widgetId || !startPosition.current) return;
    const { x, y } = event.delta;

    setWidgetPosition(widgetId, {
      top: startPosition.current.top + y,
      left: startPosition.current.left + x,
      right: startPosition.current.right - x,
      bottom: startPosition.current.bottom - y,
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== widgetId || !windowWidth) return;
    const { x: deltaX, y: deltaY } = event.delta;
    const { x, y } = event.activatorEvent as MouseEvent;
    if (windowWidth / 2 < x + deltaX) {
      setWidgetSide(widgetId, "right");
    } else {
      setWidgetSide(widgetId, "left");
    }
  };
  return (
    <Draggable
      draggableId={widgetId}
      className={`fixed rounded-lg ${className} transition-[top,transform,right,left,bottom,opacity] ${hide ? "opacity-0" : "opacity-100"} ${isDragging ? "z-20" : "z-10"}`}
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
          e.stopPropagation();
        }}
        onMouseMove={onMouseMove}
      >
        {children}
      </Card>
      <Card
        className={`absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 rounded-b-xl bg-primary/50 text-primary-foreground/70 transition-all duration-200 ${isShowToolbar && !hide ? "h-[calc(100%_+_2rem)] w-[calc(100%_+_1rem)]" : "h-full w-full"}`}
        onMouseLeave={() => !isDragging && setIsShowToolbar(widgetId, false)}
      >
        <Button
          className="absolute left-[0.5rem] top-1 h-6 w-8"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => toggletIsExpanded(widgetId)}
          aria-label="expand"
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
        <Button
          className="absolute right-[0.5rem] top-1 h-6 w-8"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => toggleWidgetHide(widgetId)}
          aria-label="hide"
        >
          <Minus
            className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
            strokeWidth={3}
          />
        </Button>
        <GripHorizontal className="absolute left-1/2 top-1 -translate-x-1/2" />
      </Card>
    </Draggable>
  );
};

export default Widget;
