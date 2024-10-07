"use client";
import Canvas from "./Canvas";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import TableModal from "../TableModal";
import ConnectLine, { CONNECT_MODE } from "./ConnectLine";
import { getConnectMode } from "@/lib/tools";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import ConnectingLine from "./ConnectingLine";
import { useEffect, useState } from "react";

const DrawingBoard = () => {
  // const relations = useWorkspaceStore((state) => state.relations);
  // const getNodePosition = useWorkspaceStore((state) => state.getNodePosition);
  // const connectingNode = useWorkspaceStore((state) => state.connectingNode);
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
        {/* {relations.map((relation, index) => {
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
        })} */}
        {/* {connectingNode && <ConnectingLine />} */}
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
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRerender((pre) => !pre); // Trigger re-render after 100ms
    }, 0);

    return () => clearTimeout(timer); // Cleanup the timer when component unmounts
  }, [tables]); // Empty dependency array ensures this runs only once on mount

  const findPositionAndWidth = (tableName: string, fieldName?: string) => {
    const ModelElement =
      typeof document !== "undefined"
        ? document.getElementById(tableName)
        : null;
    const table = tables.find((table) => table.name === tableName)!;
    const fieldIndex = table.fields.findIndex(
      (field) => field.name === fieldName,
    );
    return {
      x: table.position.x,
      y: table.position.y + 18.5 + (fieldIndex < 0 ? 0 : (fieldIndex + 1) * 37),
      width: ModelElement?.offsetWidth || 0,
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
