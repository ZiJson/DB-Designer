import { useRef, useState } from "react";
import Canvas from "./Canvas";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import TableModal from "../TableModal";
import ConnectLine from "./ConnectLine";
import { getConnectMode } from "@/lib/tools";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import ConnectingLine from "./ConnectingLine";

const DrawingBoard = () => {
  const tables = useWorkspaceStore((state) => state.tables);
  const relations = useWorkspaceStore((state) => state.relations);
  const getNodePosition = useWorkspaceStore((state) => state.getNodePosition);
  const connectingNode = useWorkspaceStore((state) => state.connectingNode);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 200, tolerance: 1000, distance: 8 },
    }),
  );
  return (
    <DndContext sensors={sensors}>
      <Canvas>
        {tables.map((table) => (
          <TableModal key={table.id} tableData={table} />
        ))}
        {relations.map((relation, index) => {
          const start = getNodePosition(
            relation.start.tableId,
            relation.start.fieldId,
          );
          const end = getNodePosition(
            relation.end.tableId,
            relation.end.fieldId,
          );
          if (!start || !end) {
            return null;
          }
          return <ConnectLine key={index} {...getConnectMode(start, end)} />;
        })}
        {connectingNode && <ConnectingLine />}
      </Canvas>
    </DndContext>
  );
};

export default DrawingBoard;
