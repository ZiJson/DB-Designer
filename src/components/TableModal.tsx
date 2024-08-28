import { Bolt, ListPlus, X } from "lucide-react";
import { type TableModal, type Field } from "@/types/Table";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import * as Sheet from "./Sheets";

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
          <FieldRow
            key={field.name}
            field={field}
            tableId={tableData.id}
            fieldId={index + 1}
          />
        ))}
      </div>
      <Drawer tableId={tableData.id} />
    </div>
  );
};

const FieldRow = ({
  field,
  tableId,
  fieldId,
}: {
  field: Field;
  tableId: number;
  fieldId: number;
}) => {
  return (
    <div className="relative flex w-full justify-between rounded-b-md px-3 py-1">
      <Node tableId={tableId} fieldId={fieldId} />
      <p>{field.name}</p>
      <p className="text-slate-400">{field.type}</p>
    </div>
  );
};

const Node = ({ tableId, fieldId }: { tableId: number; fieldId: number }) => {
  const setConnectingNode = useWorkspaceStore(
    (state) => state.setConnectingNode,
  );
  const { nodes, lines } = useWorkspaceStore((state) => state);
  const nodeId = nodes.find(
    (node) => node.tableId === tableId && node.fieldId === fieldId,
  )?.id;

  if (!nodeId) return null;

  return (
    <i
      onMouseDown={(e) => {
        e.stopPropagation();
        setConnectingNode(nodeId);
      }}
      className="absolute -right-[7px] top-[50%] h-3 w-3 translate-y-[-50%] rounded-full border-2 border-slate-600 bg-slate-100 hover:scale-125 hover:bg-slate-300"
    />
  );
};

interface DrawerProps {
  tableId: number;
}
const Drawer = ({ tableId }: DrawerProps) => {
  return (
    <div className="group absolute left-1 top-full -z-10 flex h-fit w-full -translate-y-full items-center gap-1 pt-1 transition-all group-hover:translate-y-0">
      <Sheet.AddField tableId={tableId}>
        <ListPlus className="h-8 w-8 rounded-full border-2 border-slate-500 bg-white p-1 transition-all hover:scale-105 hover:bg-slate-200" />
      </Sheet.AddField>
      <Bolt className="h-8 w-8 rounded-full border-2 border-slate-500 bg-white p-1 transition-all hover:scale-105 hover:bg-slate-200" />
    </div>
  );
};

export default TableModal;
