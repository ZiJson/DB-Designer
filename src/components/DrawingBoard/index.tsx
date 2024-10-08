"use client";
import Canvas from "./Canvas";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import TableModal from "../TableModal";
import ConnectLine, { CONNECT_MODE } from "./ConnectLine";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useEffect, useState } from "react";

const DrawingBoard = () => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 1000, distance: 10 },
    }),
  );

  return (
    <DndContext sensors={sensors}>
      <Canvas>
        <Lines />
        <Models />
      </Canvas>
    </DndContext>
  );
};

export default DrawingBoard;

const Models = () => {
  const tables = useWorkspaceStore((state) => state.tables);
  return (
    <>
      {tables.map((table) => (
        <TableModal key={table.name} tableData={table} />
      ))}
    </>
  );
};

const Lines = () => {
  const tables = useWorkspaceStore((state) => state.tables);
  const positions = useWorkspaceStore((state) => state.positions);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRerender((pre) => !pre); // Trigger re-render after 100ms
    }, 0);

    return () => clearTimeout(timer); // Cleanup the timer when component unmounts
  }, [tables]); // Empty dependency array ensures this runs only once on mount

  const findPositionAndWidth = (tableName: string, fieldName?: string) => {
    const position = positions.get(tableName) || { x: 0, y: 0 };
    const ModelElement =
      typeof document !== "undefined"
        ? document.getElementById(tableName)
        : null;
    const table = tables.find((table) => table.name === tableName)!;
    const fieldIndex = table.fields.findIndex(
      (field) => field.name === fieldName,
    );
    return {
      x: position.x,
      y: position.y + 18.5 + (fieldIndex < 0 ? 0 : (fieldIndex + 1) * 37),
      width: ModelElement?.offsetWidth || 140,
    };
  };

  const relations = tables.flatMap((table) =>
    table.fields
      .filter(
        (field) => field.kind === "object" && !field.relationFromFields?.length,
      )
      .map((field) => {
        return {
          from: [field.type],
          to: [table.name, field.name],
          name: field.relationName,
        };
      }),
  );

  return relations.map((relation, index) => {
    let node1 = findPositionAndWidth(relation.from[0], relation.from[1]);
    let node2 = findPositionAndWidth(relation.to[0], relation.to[1]);
    const mode =
      Math.abs(node1.x - node2.x) > Math.max(node1.width, node2.width) + 50
        ? CONNECT_MODE.OPPOSITE_SIDE
        : CONNECT_MODE.SAME_SIDE;

    if (mode === CONNECT_MODE.OPPOSITE_SIDE) {
      if (node1.x > node2.x) {
        node2.x += node2.width;
      } else {
        node1.x += node1.width;
      }
    } else {
      node1.x += node1.width;
      node2.x += node2.width;
    }
    return (
      <ConnectLine
        key={index}
        p1={node1}
        p2={node2}
        mode={mode}
        title={relation.name}
      />
    );
  });
};
