"use client";
import Canvas from "./Canvas";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import TableModal from "../TableModel";
import ConnectLine, { CONNECT_MODE } from "./ConnectLine";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import EnumModel from "../EnumModel";

const DrawingBoard = () => {
  return (
    <Canvas>
      <Lines />
      <Models />
    </Canvas>
  );
};

export default DrawingBoard;

const Models = () => {
  const models = useWorkspaceStore((state) => state.models);
  const enums = useWorkspaceStore((state) => state.enums);
  return (
    <>
      {models.map((model) => <TableModal key={model.name} tableData={model} />)}
      {enums.map((enumData) => (
        <EnumModel key={enumData.name} enumData={enumData} />
      ))}
    </>
  );
};

const Lines = () => {
  const models = useWorkspaceStore((state) => state.models);
  const enums = useWorkspaceStore((state) => state.enums);
  const positions = useWorkspaceStore((state) => state.positions);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRerender((pre) => !pre); // Trigger re-render after 100ms
    }, 0);

    return () => clearTimeout(timer); // Cleanup the timer when component unmounts
  }, [models]); // Empty dependency array ensures this runs only once on mount

  const findPositionAndWidth = (tableName: string, fieldName?: string) => {
    const position = positions[tableName] || { x: 0, y: 0 };
    const ModelElement = typeof document !== "undefined"
      ? document.getElementById(tableName)
      : null;
    const table = [...models, ...enums].find((model) =>
      model.name === tableName
    )!;
    const rowIndex = "fields" in table
      ? table.fields.findIndex((field) => field.name === fieldName)
      : table.values.findIndex((value) => value.name === fieldName);
    return {
      x: position.x,
      y: position.y + 18.5 + (rowIndex < 0 ? 0 : (rowIndex + 1) * 37),
      width: ModelElement?.offsetWidth || 140,
    };
  };

  const relations = models.flatMap((model) =>
    model.fields
      .filter(
        (field) =>
          (field.kind === "object" && !field.relationFromFields?.length) ||
          field.kind === "enum",
      )
      .map((field) => {
        return {
          from: [field.type],
          to: [model.name, field.name],
          name: field.kind === "enum" ? "" : field.relationName,
        };
      })
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
