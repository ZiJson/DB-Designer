import { Coordinates } from "@dnd-kit/core/dist/types";
import { useEffect, useRef, useState } from "react";
import Path, { Svg } from "react-svg-path";
import ConnectLine, { CONNECT_MODE } from "./ConnectLine";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { getCloserPoint } from "@/lib/tools";

type Props = {
  canvasRef: React.RefObject<HTMLDivElement>;
};
const ConnectingLine = ({ canvasRef }: Props) => {
  const connectedNodeIdRef = useRef<number | null>(null);
  const canvasScale = useWorkspaceStore((state) => state.canvas.scale);
  const nodes = useWorkspaceStore((state) => state.nodes);
  const addLine = useWorkspaceStore((state) => state.addLine);
  const setIsConnecting = useWorkspaceStore((state) => state.setConnectingNode);
  const connectingNode = useWorkspaceStore((state) => state.connectingNode);
  const fixedPoints: Coordinates = nodes.find(
    (node) => node.id === connectingNode,
  )?.coordinates || { x: 0, y: 0 };
  const [mousePosition, setMousePosition] = useState<Coordinates>(fixedPoints);
  const otherNodes = nodes.filter((node) => node.id !== connectingNode);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / canvasScale;
      const mouseY = (event.clientY - rect.top) / canvasScale;
      const closestPointIndex = getCloserPoint(
        { x: mouseX, y: mouseY },
        otherNodes.map((node) => node.coordinates),
        20,
      );

      setMousePosition(
        closestPointIndex !== null
          ? otherNodes[closestPointIndex].coordinates
          : { x: mouseX, y: mouseY },
      );

      connectedNodeIdRef.current =
        closestPointIndex !== null ? otherNodes[closestPointIndex].id : null;
    };
    window.addEventListener("mousemove", handleMouseMove, { capture: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canvasRef, canvasScale, otherNodes, nodes]);

  useEffect(() => {
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [connectingNode]);

  const onMouseUp = () => {
    setIsConnecting(null);
    console.log(connectingNode, connectedNodeIdRef.current);
    connectedNodeIdRef.current &&
      connectingNode &&
      addLine(connectingNode, connectedNodeIdRef.current);
  };

  return (
    <div onMouseUp={onMouseUp}>
      <ConnectLine
        p1={fixedPoints}
        p2={mousePosition}
        mode={CONNECT_MODE.STRAIGHT}
      />
      <i
        className="absolute h-3 w-3 translate-x-[-50%] translate-y-[-50%] rounded-full border-2 border-slate-600 bg-slate-300"
        style={{ left: mousePosition.x - 1, top: mousePosition.y - 1 }}
      />
    </div>
  );
};

export default ConnectingLine;
