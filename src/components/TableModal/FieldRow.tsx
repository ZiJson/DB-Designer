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
  return <BaseFieldRow field={field} tableId={tableId} fieldId={fieldId} />;
};

const BaseFieldRow = ({
  field,
  tableId,
  fieldId,
}: {
  field: Field;
  tableId: number;
  fieldId: number;
}) => (
  <div className="relative flex w-full justify-between rounded-md px-3 py-1 hover:bg-gray-50">
    <Node tableId={tableId} fieldId={fieldId} />
    <p>{field.name}</p>
    <p className="text-slate-400">{field.type}</p>
  </div>
);

// const RelationFieldRow = ({
//   field,
//   tableId,
//   fieldId,
// }: {
//   field: RelationField;
//   tableId: number;
//   fieldId: number;
// }) => {
//   const targetTable = useWorkspaceStore((state) =>
//     state.tables.find((table) => table.id === field.relation.tableId),
//   );
//   if (!targetTable) return null;

//   return (
//     <div className="relative flex w-full justify-between rounded-md px-3 py-1 hover:bg-gray-50">
//       <Node tableId={tableId} fieldId={fieldId} />
//       <p>{field.name}</p>
//       <p className="font-semibold text-slate-500">{targetTable.name}</p>
//     </div>
//   );
// };

export default FieldRow;
