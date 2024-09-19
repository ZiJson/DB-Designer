import { Field, FieldToggle, TableModal, ToggleType } from "@/types/Table";
import { Badge } from "@/components/ui/badge";

const RelationInfoCard = ({
  relation,
  targetTable,
  fieldName,
}: {
  relation: Field["relations"][number];
  targetTable: TableModal;
  fieldName: string;
}) => {
  const targetField = targetTable.fields.find(
    (field) => field.id === relation.fieldId,
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2 mb-1 flex items-baseline justify-between gap-1">
        <p className="scroll-m-20 text-xl font-semibold tracking-tight">
          {relation.name}
        </p>
        <p className="text-slate-400">{targetTable.name}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-sm text-slate-400">field:</p>
        <p className="text-sm">{fieldName}</p>
      </div>
      <div className="flex justify-end gap-1">
        <p className="text-sm text-slate-400">reference:</p>
        <p className="text-sm">{targetField?.name}</p>
      </div>
      <div className="col-span-2 flex flex-wrap gap-2">
        {[ToggleType.Array, ToggleType.Nullable].map((t) => (
          <Badge
            key={t}
            className="pt-1"
            variant={
              relation[t as keyof Field["relations"][number]]
                ? "default"
                : "secondary"
            }
          >
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RelationInfoCard;
