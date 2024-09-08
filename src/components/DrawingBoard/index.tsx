import { useRef, useState } from "react";
import Canvas from "./Canvas";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import TableModal from "../TableModal";
import ConnectLine from "./ConnectLine";
import { getConnectMode } from "@/lib/tools";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";

const DrawingBoard = () => {
  const [isItemDragging, setIsItemDragging] = useState(false);

  const { tables, removeTable, nodes, lines, scale } = useWorkspaceStore(
    (state) => state,
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 200, tolerance: 100, distance: 8 },
    }),
  );
  return (
    <DndContext sensors={sensors}>
      <Canvas isItemDragging={isItemDragging}>
        {tables.map((table) => (
          <TableModal
            key={table.id}
            onRemove={() => removeTable(table.id)}
            tableData={table}
          />
        ))}
        {/* <div className="absolute -z-10">
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
        </div> */}
      </Canvas>
    </DndContext>
  );
};

export default DrawingBoard;
