import React from "react";
import { X } from "lucide-react";
import { type TableModal, type Field } from "@/types/Table";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

interface Props {
  onRemove: () => void;
  tableData: TableModal;
}
const TableModal = ({ onRemove, tableData }: Props) => {
  return (
    <div className=" w-36 h-fit border-2 bg-white border-slate-500 rounded-lg ">
      <header className="font-semibold py-1 border-b-2 border-slate-500 bg-slate-100 relative rounded-t-md">
        <X
          className="absolute right-1  cursor-pointer text-slate-500 hover:text-slate-900"
          onClick={onRemove}
        />
        {tableData.name}
      </header>
      <div className="">
        {tableData.fields.map((field, index) => (
          <FieldRow
            key={field.name}
            field={field}
            tableId={tableData.id}
            fieldId={index + 1}
          />
        ))}
      </div>
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
    <div className="w-full flex justify-between py-1 px-3 relative rounded-b-md">
      <Node tableId={tableId} fieldId={fieldId} />
      <p>{field.name}</p>
      <p className="text-slate-400 ">{field.type.name}</p>
    </div>
  );
};

const Node = ({ tableId, fieldId }: { tableId: number; fieldId: number }) => {
  const setConnectingNode = useWorkspaceStore(
    (state) => state.setConnectingNode
  );
  const { nodes, lines } = useWorkspaceStore((state) => state);
  const nodeId = nodes.find(
    (node) => node.tableId === tableId && node.fieldId === fieldId
  )?.id;

  if (!nodeId) return null;

  return (
    <i
      onMouseDown={(e) => {
        e.stopPropagation();
        setConnectingNode(nodeId);
      }}
      className=" absolute bg-slate-100 border-2 border-slate-600 w-3 h-3 rounded-full top-[50%] -right-[7px] translate-y-[-50%] hover:scale-125 hover:bg-slate-300"
    />
  );
};

export default TableModal;
