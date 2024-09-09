"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDraggable, useDndMonitor } from "@dnd-kit/core";
import { type DragEndEvent } from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { shallow } from "zustand/shallow";
import { Transform } from "stream";
import { Coordinates } from "@dnd-kit/core/dist/types";
interface Props {
  children: React.ReactNode;
  draggableId: string;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragStart?: (event: DragEndEvent) => void;
  onDragMove?: (event: DragEndEvent) => void;
  setTransform?: (transform: Coordinates | null) => void;
  className?: string;
  disabled?: boolean;
}

function Draggable({
  onDragEnd,
  onDragStart,
  onDragMove,
  setTransform,
  draggableId,
  children,
  className,
  disabled = false,
}: Props) {
  const scale = useWorkspaceStore((state) => state.scale);
  useDndMonitor({ onDragEnd, onDragStart, onDragMove });
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableId,
      disabled,
    });

  useEffect(() => {
    if (!setTransform) return;
    transform
      ? setTransform({ x: transform.x, y: transform.y })
      : setTransform(null);
  }, [transform, setTransform]);

  const transformStyle = !setTransform &&
    transform && {
      transform: `translate3d(${transform.x / scale}px, ${transform.y / scale}px, 0)`,
    };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ ...transformStyle }}
      className={`${className} ${isDragging ? "cursor-grabbing" : ""}`}
    >
      {children}
    </div>
  );
}

export default Draggable;
