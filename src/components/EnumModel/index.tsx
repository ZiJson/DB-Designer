import { type TableModal, type Field } from "@/types/Table";
import Draggable from "../dnd/Draggable";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { DragMoveEvent, DragStartEvent, useDraggable } from "@dnd-kit/core";
import { memo, useRef } from "react";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { ColumnDef } from "@tanstack/react-table";
import { DMMF } from "@prisma/generator-helper";
import { MutableDeep } from "@/stores/TableStore";
import DataTable from "../DataTable";
interface Props {
  enumData: DMMF.DatamodelEnum;
}
const EnumModal = ({ enumData }: Props) => {
  const startPosition = useRef<Coordinates | null>(null);
  const updateTablePosition = useWorkspaceStore(
    (state) => state.updateTablePosition,
  );
  const scale = useWorkspaceStore((state) => state.scale);
  const position = useWorkspaceStore(
    (state) => state.positions[enumData.name] || { x: 0, y: 0 },
  );

  const onDragMove = (event: DragMoveEvent) => {
    if (event.active.id !== enumData.name || !startPosition.current) return;
    const { x, y } = event.delta;
    updateTablePosition(enumData.name, {
      x: startPosition.current.x + x / scale,
      y: startPosition.current.y + y / scale,
    });
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.id !== enumData.name) return;
    startPosition.current = position;
  };

  const positionStyle = {
    top: position.y,
    left: position.x,
  };
  const { isDragging } = useDraggable({
    id: enumData.name,
  });

  return (
    <Draggable
      draggableId={enumData.name}
      isTransform={false}
      onDragMove={onDragMove}
      onDragStart={onDragStart}
      className="transition-none"
      style={positionStyle}
    >
      <DataTable
        columns={columns}
        data={enumData.values as MutableDeep<DMMF.EnumValue>[]}
        title={enumData.name}
        isEnum
        className={`group absolute z-20 min-w-40 bg-card text-card-foreground shadow-lg transition-transform ${
          isDragging ? "scale-105 shadow-xl" : ""
        }`}
      />
    </Draggable>
  );
};

export default memo(EnumModal);

type FieldTableCol = {
  name: string;
};

export const columns: ColumnDef<FieldTableCol, MutableDeep<DMMF.EnumValue>>[] =
  [
    {
      accessorKey: "name",
    },
  ];
