"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDraggable, useDndMonitor } from "@dnd-kit/core";
import { type DragEndEvent } from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { shallow } from "zustand/shallow";
interface Props {
  children: React.ReactNode;
  draggableId: string;
  scale: number;
  setIsItemDragging: (isDragging: boolean) => void;
}

function Draggable(props: Props) {
  // const startPosition = useCallback(() => {
  //   if (!props.canvasRef.current) return { x: 0, y: 0 };
  //   const { x, y } = props.canvasRef.current.getBoundingClientRect();
  //   return { x: (-x + 10) / props.scale, y: (-y + 10) / props.scale };
  // }, [props.canvasRef, props.scale]);
  const updateNode = useWorkspaceStore((state) => state.updateNode);
  const setPosition = useWorkspaceStore((state) => state.setTablePosition);
  const table = useWorkspaceStore(
    (state) => state.tables.find((t) => t.id === +props.draggableId),
    shallow,
  )!;
  console.log(123);
  const position = table?.position;
  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== props.draggableId) return;
    const { x, y } = event.delta;
    setPosition(table.id, {
      x: position.x + x / props.scale,
      y: position.y + y / props.scale,
    });
    props.setIsItemDragging(false);
  };
  const onDragStart = (event: DragEndEvent) => {
    props.setIsItemDragging(true);
  };
  const onDragMove = (event: DragEndEvent) => {
    if (event.active.id !== props.draggableId) return;
    const { x, y } = event.delta;
    updateNode(+props.draggableId, {
      x: position.x + x / props.scale,
      y: position.y + y / props.scale,
    });
  };
  useDndMonitor({ onDragEnd, onDragStart, onDragMove });
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.draggableId,
    });
  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x / props.scale}px, ${
          transform.y / props.scale
        }px, 0)`,
      }
    : undefined;
  const positionStyle = position
    ? {
        top: `${position.y}px`,
        left: `${position.x}px`,
      }
    : undefined;
  return (
    <div
      onMouseMove={(e) => {
        e.stopPropagation();
      }}
      ref={setNodeRef}
      className="fixed rounded-xl text-center"
      style={{ ...transformStyle, ...positionStyle }}
      {...listeners}
      {...attributes}
    >
      <div
        className={`transition-all duration-150 ease-in-out ${
          isDragging ? "scale-[1.06] cursor-grabbing shadow-xl" : "scale-100"
        }`}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Draggable;
