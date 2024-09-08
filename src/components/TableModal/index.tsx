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
import { DragEndEvent } from "@dnd-kit/core";
import { shallow } from "zustand/shallow";

interface Props {
  onRemove: () => void;
  tableData: TableModal;
}
const TableModal = ({ onRemove, tableData }: Props) => {
  const updateTablePosition = useWorkspaceStore(
    (state) => state.updateTablePosition,
  );
  const position = useWorkspaceStore(
    (state) =>
      state.tables.find((table) => table.id === tableData.id)!.position,
    shallow,
  );
  const onDragEnd = (event: DragEndEvent) => {
    if (event.active.id !== tableData.id.toString()) return;
    const { x, y } = event.delta;
    console.log(132);
    updateTablePosition(tableData.id, { x: x + position.x, y: y + position.y });
  };
  const positionStyle = {
    top: position.y,
    left: position.x,
  };
  return (
    <Draggable draggableId={tableData.id.toString()} onDragEnd={onDragEnd}>
      <div
        className="group absolute h-fit w-36 rounded-lg border-2 border-slate-500 bg-white"
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
              <HoverCard openDelay={400}>
                <HoverCardTrigger>
                  <FieldRow
                    field={field}
                    tableId={tableData.id}
                    fieldId={index + 1}
                  />
                </HoverCardTrigger>
                <HoverCardContent side="left" sideOffset={10} align="start">
                  <FieldInfoCard field={field} />
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
        <Drawer tableId={tableData.id} />
      </div>
    </Draggable>
  );
};

export default TableModal;
