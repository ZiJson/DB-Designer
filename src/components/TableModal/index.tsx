import { X } from "lucide-react";
import { type TableModal, type Field } from "@/types/Table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import FieldInfoCard from "./FieldInfoCard";
import Drawer from "./Drawer";
import FieldRow from "./FieldRow";
import Draggable from "../dnd/Draggable";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import {
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  useDndMonitor,
  useDraggable,
} from "@dnd-kit/core";
import { shallow } from "zustand/shallow";
import { useRef, useState } from "react";
import { Coordinates } from "@dnd-kit/core/dist/types";

interface Props {
  tableData: TableModal;
}
const TableModal = ({ tableData }: Props) => {
  const [transform, setTransform] = useState<Coordinates | null>(null);
  const setActiveTableId = useWorkspaceStore((state) => state.setActiveTableId);
  const updateTablePosition = useWorkspaceStore(
    (state) => state.updateTablePosition,
  );
  const removeTable = useWorkspaceStore((state) => state.removeTable);
  const updateTableTransform = useWorkspaceStore(
    (state) => state.updateTableTransform,
  );
  const scale = useWorkspaceStore((state) => state.scale);
  const position = useWorkspaceStore(
    (state) =>
      state.tables.find((table) => table.id === tableData.id)!.position,
    shallow,
  );

  const onDragMove = (event: DragMoveEvent) => {
    if (event.active.id !== tableData.id.toString()) return;
    const { x, y } = event.delta;
    updateTableTransform(tableData.id, {
      x: x,
      y: y,
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== tableData.id.toString()) return;

    const { x, y } = event.delta;
    updateTableTransform(tableData.id, {
      x: 0,
      y: 0,
    });
    updateTablePosition(tableData.id, {
      x: x / scale + position.x,
      y: y / scale + position.y,
    });
  };

  const onRemove = () => {
    removeTable(tableData.id);
  };
  const positionStyle = {
    top: position.y,
    left: position.x,
  };
  const { isDragging } = useDraggable({
    id: tableData.id.toString(),
  });
  return (
    <Draggable
      draggableId={tableData.id.toString()}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
    >
      <div
        className={`group absolute h-fit w-36 rounded-lg border-2 border-slate-500 bg-white ${
          isDragging ? "scale-105 shadow-lg transition-all" : ""
        }`}
        onClick={() => setActiveTableId(tableData.id)}
        style={positionStyle}
      >
        <div className="relative rounded-t-md border-b-2 border-slate-500 bg-slate-100 px-3 py-1 font-semibold">
          <X
            className="absolute right-1 cursor-pointer text-slate-500 hover:text-slate-900"
            onClick={onRemove}
          />
          {tableData.name}
        </div>
        <div className="divide-y divide-solid">
          {tableData.fields.map((field, index) => (
            <div key={field.name}>
              <FieldRow field={field} tableId={tableData.id} />
            </div>
          ))}
        </div>
        {/* <Drawer tableId={tableData.id} /> */}
      </div>
    </Draggable>
  );
};

export default TableModal;
