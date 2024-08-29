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

interface Props {
  onRemove: () => void;
  tableData: TableModal;
}
const TableModal = ({ onRemove, tableData }: Props) => {
  return (
    <div className="group h-fit w-36 rounded-lg border-2 border-slate-500 bg-white">
      <div className="relative rounded-t-md border-b-2 border-slate-500 bg-slate-100 py-1 font-semibold">
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
  );
};

export default TableModal;
