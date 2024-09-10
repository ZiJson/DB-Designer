"use client";
import React, { useState } from "react";
import { DragEndEvent, useDraggable } from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import Draggable from "../dnd/Draggable";
import { Coordinates } from "@dnd-kit/core/dist/types";

const canvasId = "canvas";

interface Props {
  children?: React.ReactNode;
}
const Canvas = ({ children }: Props) => {
  const position = useWorkspaceStore((state) => state.position);
  const setPosition = useWorkspaceStore((state) => state.setCanvasPosition);
  const scale = useWorkspaceStore((state) => state.scale);
  const setScale = useWorkspaceStore((state) => state.setScale);

  const { isDragging, transform } = useDraggable({
    id: canvasId,
  });
  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== canvasId) return;
    const { x, y } = event.delta;
    setPosition({
      x: position.x + x,
      y: position.y + y,
    });
  };
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { x: canvasX, y: canvasY } = position;

    const { deltaY, clientX, clientY } = e;
    const scaleSize = deltaY < 0 ? 0.1 : -0.1;
    const tx = (clientX - canvasX) * scaleSize;
    const ty = (clientY - canvasY) * scaleSize;
    setScale(scale * (1 + scaleSize));
    setPosition({
      x: position.x - tx,
      y: position.y - ty,
    });
  };
  const positionStyle = {
    top: position.y,
    left: position.x,
  };
  const transformStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${scale})`
      : `scale(${scale})`,
  };
  return (
    <div onWheel={onWheel}>
      <Draggable
        draggableId={canvasId}
        onDragEnd={onDragEnd}
        isTransform={false}
        className="absolute inset-0 h-full w-full overflow-hidden bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"
      >
        <div
          style={{ ...positionStyle, ...transformStyle }}
          id="canvas"
          className="fixed h-8 w-8 border-4 border-b-0 border-r-0 border-solid border-slate-600"
        >
          {children}
        </div>
      </Draggable>
    </div>
  );
};

export default Canvas;
