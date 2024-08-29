import { Field } from "@/types/Table";
import Node from "./Node";

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
    <div className="relative flex w-full justify-between rounded-md px-3 py-1 hover:bg-gray-50">
      <Node tableId={tableId} fieldId={fieldId} />
      <p>{field.name}</p>
      <p className="text-slate-400">{field.type}</p>
    </div>
  );
};

export default FieldRow;
