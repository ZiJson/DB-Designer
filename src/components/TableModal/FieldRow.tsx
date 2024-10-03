import { Field } from "@/types/Table";
import Node from "./Node";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { shallow } from "zustand/shallow";
import { CornerLeftUp } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import RelationInfoCard from "./RelationInfoCard";
import { useDraggable } from "@dnd-kit/core";
import FieldInfoCard from "./FieldInfoCard";
import { ModelField } from "@/types/Database";

interface Props {
  tableName: string;
  field: ModelField;
}

const FieldRow = ({ field, tableName }: Props) => {
  const { isDragging } = useDraggable({
    id: tableName,
  });
  return (
    <div className="divide-y divide-solid">
      <HoverCard openDelay={400}>
        <HoverCardTrigger>
          <div className="relative flex w-full justify-between rounded-md px-3 py-1 hover:bg-gray-50">
            {/* <Node tableId={tableId} fieldId={field.id} /> */}
            <p>{field.name}</p>
            <p className="text-slate-400">
              {field.type}
              {field.isList && "[]"}
            </p>
          </div>
        </HoverCardTrigger>
        {!isDragging && (
          <HoverCardContent side="left" sideOffset={10} align="start">
            <FieldInfoCard field={field} />
          </HoverCardContent>
        )}
      </HoverCard>

      {/* {field.relations.map((relation) => (
        <RelationFieldRow
          key={relation.fieldId}
          relation={relation}
          fieldName={field.name}
        />
      ))} */}
    </div>
  );
};

// const RelationFieldRow = ({
//   relation,
//   fieldName,
// }: {
//   relation: Field["relations"][number];
//   fieldName: string;
// }) => {
//   const targetTable = useWorkspaceStore(
//     (state) => state.tables.find((table) => table.id === relation.tableId),
//     shallow,
//   );
//   if (!targetTable) return null;
//   return (
//     <HoverCard openDelay={400}>
//       <HoverCardTrigger>
//         <div className="relative flex w-full items-center justify-end gap-1 rounded-md px-3 py-1 hover:bg-gray-50">
//           <CornerLeftUp
//             strokeWidth={3}
//             className="h-4 w-4 flex-shrink-0 text-slate-400"
//           />
//           <p className="whitespace-nowrap">{relation.name}</p>
//           <p className="whitespace-nowrap font-bold text-slate-500">
//             {targetTable.name}
//             {relation.toArray && "[]"}
//           </p>
//         </div>
//       </HoverCardTrigger>
//       <HoverCardContent side="left" sideOffset={10} align="start">
//         <RelationInfoCard
//           relation={relation}
//           targetTable={targetTable}
//           fieldName={fieldName}
//         />
//       </HoverCardContent>
//     </HoverCard>
//   );
// };

export default FieldRow;
