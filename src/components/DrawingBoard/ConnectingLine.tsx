import { Coordinates } from "@dnd-kit/core/dist/types";
import { useEffect, useRef, useState } from "react";
import Path, { Svg } from "react-svg-path";
import ConnectLine, { CONNECT_MODE } from "./ConnectLine";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { getCloserPoint } from "@/lib/tools";
import { shallow } from "zustand/shallow";

const ConnectingLine = () => {
  const canvasPosition = useWorkspaceStore((state) => state.position);
  const canvasScale = useWorkspaceStore((state) => state.scale);
  const connectingNode = useWorkspaceStore((state) => state.connectingNode)!;
  const getNodePosition = useWorkspaceStore((state) => state.getNodePosition);
  const addRelation = useWorkspaceStore((state) => state.addRelation);
  const clearConnectingNode = useWorkspaceStore(
    (state) => state.clearConnectingNode,
  );
  const connectedNodeIdRef = useRef<{
    tableId: string;
    fieldId: string;
    coordinates: Coordinates;
  } | null>(null);
  const allNodes = useWorkspaceStore((state) => state.getAllNodes(), shallow);
  const fixedPoint = getNodePosition(
    connectingNode.tableId,
    connectingNode.fieldId,
  );
  const [mousePosition, setMousePosition] = useState<Coordinates>(fixedPoint);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasPosition;
      const mouseX = (event.clientX - rect.x) / canvasScale;
      const mouseY = (event.clientY - rect.y) / canvasScale;
      const closestPointIndex = getCloserPoint(
        { x: mouseX, y: mouseY },
        allNodes.map((node) => node.coordinates),
        20,
      );
      setMousePosition(
        closestPointIndex !== null
          ? allNodes[closestPointIndex].coordinates
          : { x: mouseX, y: mouseY },
      );

      connectedNodeIdRef.current =
        closestPointIndex !== null ? allNodes[closestPointIndex] : null;
    };
    window.addEventListener("mousemove", handleMouseMove, { capture: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canvasScale, canvasPosition]);

  useEffect(() => {
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [connectingNode]);

  const onMouseUp = () => {
    connectedNodeIdRef.current &&
      connectingNode &&
      addRelation({
        start: {
          ...connectingNode,
        },
        end: {
          tableId: connectedNodeIdRef.current.tableId,
          fieldId: connectedNodeIdRef.current.fieldId,
        },
      });
    clearConnectingNode();
  };

  useEffect(() => {
    const MouseUpHandler = (event: MouseEvent) => {
      connectedNodeIdRef.current &&
        connectingNode &&
        addRelation({
          start: {
            ...connectingNode,
          },
          end: {
            tableId: connectedNodeIdRef.current.tableId,
            fieldId: connectedNodeIdRef.current.fieldId,
          },
        });
      clearConnectingNode();
    };
    window.addEventListener("mouseup", MouseUpHandler);
    return () => window.removeEventListener("mouseup", MouseUpHandler);
  }, []);

  return (
    <div>
      <ConnectLine
        p1={fixedPoint}
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
