import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Field, FieldToggle } from "@/types/Table";
import { memo } from "react";
import { CustomToggle } from "@/components/CustomUI";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

interface Props {
  relation: Field["relations"][number];
  tableId: string;
  field: Field;
}
const Relation = ({ relation, field, tableId }: Props) => {
  const {
    fieldId: targetFieldId,
    tableId: targetTableId,
    name,
    ...toggles
  } = relation;
  const updateField = useWorkspaceStore((state) => state.updateField);
  const targetTable = useWorkspaceStore(
    (state) => state.tables.find((t) => t.id === targetTableId)!,
  );
  const targetField = targetTable.fields.find((f) => f.id === targetFieldId)!;
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    updateField(tableId, {
      ...field,
      relations: field.relations.map((r) => {
        if (r.fieldId === targetFieldId && r.tableId === targetTableId) {
          return { ...r, name: e.target.value };
        }
        return r;
      }),
    });
  };

  const onToggleChange = (toggleKey: string) => (pressed: boolean) => {
    updateField(tableId, {
      ...field,
      relations: field.relations.map((r) => {
        if (r.fieldId === targetFieldId && r.tableId === targetTableId) {
          return { ...r, [toggleKey]: pressed };
        }
        return r;
      }),
    });
  };
  return (
    <div className="grid grid-cols-3 items-end gap-2">
      <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
        <Label
          htmlFor={`toField-${targetFieldId}`}
          className="flex items-center gap-1"
        >
          <Badge variant="outline" className="rounded-md">
            R
          </Badge>
          Name
        </Label>
        <Input
          type="text"
          id={`toField-${targetFieldId}`}
          defaultValue={name}
          onChange={onNameChange}
        />
      </div>
      <div className="flex gap-1">
        {Object.entries(toggles).map(([key, value]) => (
          <CustomToggle
            key={key}
            toggleKey={key}
            pressed={value}
            onPressedChange={onToggleChange(key)}
            tooltipContent={key}
          />
        ))}
      </div>
      <p className="col-span-3 text-sm">
        reference:{" "}
        <Badge className="rounded-md" variant="secondary">
          {targetTable.name}
        </Badge>
        -
        <Badge className="rounded-md" variant="secondary">
          {targetField.name}
        </Badge>
      </p>
    </div>
  );
};

export default memo(Relation);
