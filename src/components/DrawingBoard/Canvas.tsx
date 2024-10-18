"use client";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDraggable,
} from "@dnd-kit/core";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import Draggable from "../dnd/Draggable";
import { useRef, useState } from "react";
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
  const [isScaling, setIsScaling] = useState(false);
  const startPosition = useRef<Coordinates | null>(null);
  // 使用 useRef 保存 scaleTimeout
  const scaleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.id !== canvasId) return;
    startPosition.current = position;
  };
  const onDragMove = (event: DragMoveEvent) => {
    if (event.active.id !== canvasId || !startPosition.current) return;
    const { x, y } = event.delta;
    setPosition({
      x: startPosition.current.x + x,
      y: startPosition.current.y + y,
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
    // 設置isScaling為true
    setIsScaling(true);

    // 清除之前的timeout
    if (scaleTimeoutRef.current) {
      clearTimeout(scaleTimeoutRef.current);
    }

    // 設置一個新的timeout來在滾動結束後一段時間將isScaling設置為false
    scaleTimeoutRef.current = setTimeout(() => {
      setIsScaling(false);
    }, 300); // 300ms之後將isScaling設為false
  };
  const positionStyle = {
    top: position.y,
    left: position.x,
    scale: scale,
  };
  const { isDragging } = useDraggable({ id: canvasId });
  return (
    <div onWheel={onWheel} className="relative h-screen w-screen">
      <Draggable
        draggableId={canvasId}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        isTransform={false}
        className="absolute inset-0 h-full w-full overflow-hidden bg-background bg-opacity-10 bg-canvas bg-[size:20px_20px]"
      >
        <div
          style={{ ...positionStyle }}
          id="canvas"
          className={`absolute ${
            isScaling ? "transition-none" : "transition-all"
          } ${isDragging ? "duration-200 ease-out" : "duration-500"}`}
        >
          {children}
        </div>
      </Draggable>
    </div>
  );
};

export default Canvas;
