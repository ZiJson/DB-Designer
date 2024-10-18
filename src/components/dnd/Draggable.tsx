"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DndMonitorListener, useDndMonitor, useDraggable } from "@dnd-kit/core";
import { type DragEndEvent } from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { shallow } from "zustand/shallow";
import { Transform } from "stream";
import { Coordinates } from "@dnd-kit/core/dist/types";
interface Props extends DndMonitorListener {
  children: React.ReactNode;
  draggableId: string;
  isTransform?: boolean;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

function Draggable({
  onDragEnd,
  onDragStart,
  onDragMove,
  onDragOver,
  isTransform = true,
  draggableId,
  children,
  className,
  disabled = false,
  style,
}: Props) {
  const scale = useWorkspaceStore((state) => state.scale);
  useDndMonitor({ onDragEnd, onDragStart, onDragMove, onDragOver });
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: draggableId,
      disabled,
    });

  const transformStyle = isTransform &&
    transform && {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ ...style, ...transformStyle }}
      className={`${className} fixed ease-out ${
        isDragging ? "cursor-grabbing duration-300" : "cursor-auto duration-500"
      } `}
    >
      {children}
    </div>
  );
}

export default Draggable;
