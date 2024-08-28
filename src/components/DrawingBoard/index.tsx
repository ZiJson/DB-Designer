import { useRef, useState } from "react";
import Canvas from "./Canvas";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import Draggable from "../dnd/Draggable";
import TableModal from "../TableModal";
import ConnectLine from "./ConnectLine";
import { getConnectMode } from "@/lib/tools";

const DrawingBoard = () => {
  const [isItemDragging, setIsItemDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    tables,
    addTable,
    removeTable,
    nodes,
    lines,
    canvas: { scale: canvasScale },
  } = useWorkspaceStore((state) => state);
  return (
    <Canvas isItemDragging={isItemDragging} canvasRef={canvasRef}>
      {tables.map((table) => (
        <Draggable
          key={table.id}
          draggableId={table.id.toString()}
          scale={canvasScale}
          setIsItemDragging={setIsItemDragging}
          canvasRef={canvasRef}
        >
          <TableModal
            onRemove={() => removeTable(table.id)}
            tableData={table}
          />
        </Draggable>
      ))}
      <div className="absolute -z-10">
        {lines.map((line) => {
          const [node1, node2] = nodes.filter((node) =>
            line.NodeIds.includes(node.id),
          );
          if (!node1 || !node2) {
            return null;
          }

          return (
            <ConnectLine
              key={line.id}
              {...getConnectMode(node1.coordinates, node2.coordinates)}
            />
          );
        })}
      </div>
    </Canvas>
  );
};

export default DrawingBoard;
