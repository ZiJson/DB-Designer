"use client";
import React, { useState, useRef } from "react";
import { DndContext, useSensors, useSensor, MouseSensor } from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import ConnectingLine from "./ConnectingLine";

type Position = {
  x: number;
  y: number;
};

interface Props {
  children: React.ReactNode;
  isItemDragging: boolean;
}
const Canvas = ({ children, isItemDragging }: Props) => {
  const canvasPosition = useWorkspaceStore((state) => state.canvas.position);
  const setCanvasPosition = useWorkspaceStore(
    (state) => state.setCanvasPosition,
  );
  const [canvasTranslate, setCanvasTranslate] = useState({ x: 0, y: 0 });
  const [mouseStart, setMouseStart] = useState<null | Position>(null);

  const { scaling, canvas, connectingNode } = useWorkspaceStore(
    (state) => state,
  );

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isItemDragging) return;
    setMouseStart({ x: e.clientX, y: e.clientY });
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseStart || isItemDragging) return;
    const deltaX = e.clientX - mouseStart.x;
    const deltaY = e.clientY - mouseStart.y;
    setCanvasTranslate((pre) => ({
      x: deltaX,
      y: deltaY,
    }));
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseStart(null);
    setCanvasPosition({
      x: canvasPosition.x + canvasTranslate.x,
      y: canvasPosition.y + canvasTranslate.y,
    });
    setCanvasTranslate({
      x: 0,
      y: 0,
    });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const { x: canvasX, y: canvasY } = canvasPosition;

    const { deltaY, clientX, clientY } = e;
    const scaleSize = deltaY < 0 ? 0.1 : -0.1;
    const tx = (clientX - canvasX) * scaleSize;
    const ty = (clientY - canvasY) * scaleSize;
    scaling(canvas.scale * (1 + scaleSize));
    setCanvasPosition({
      x: canvasPosition.x - tx,
      y: canvasPosition.y - ty,
    });
  };

  const canvasScaleStyle = {
    transform: `scale(${canvas.scale})`,
  };
  const canvasPositionStyle = {
    top: `${canvasPosition.y}px`,
    left: `${canvasPosition.x}px`,
  };
  const canvasTranslateStyle = canvasTranslate
    ? {
        translate: `${canvasTranslate.x}px ${canvasTranslate.y}px`,
      }
    : {};

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 200, tolerance: 100, distance: 8 },
    }),
  );
  return (
    <DndContext sensors={sensors}>
      <div
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        className="absolute inset-0 h-full w-full overflow-hidden bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"
      >
        <div
          id="canvas"
          style={{
            ...canvasPositionStyle,
            ...canvasTranslateStyle,
            ...canvasScaleStyle,
          }}
          className="fixed h-8 w-8 border-4 border-b-0 border-r-0 border-solid border-slate-600"
        >
          {children}
          {connectingNode && <ConnectingLine />}
        </div>
      </div>
    </DndContext>
  );
};

export default Canvas;
