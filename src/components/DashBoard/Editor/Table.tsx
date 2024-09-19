import { FieldToggle, TableModal, ToggleType } from "@/types/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldTypes } from "@/types/FieldTypes";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import {
  FocusEvent,
  FormEvent,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Check, ListPlus, Pencil } from "lucide-react";
import * as Sheet from "../../Sheets";
import { Button } from "@/components/ui/button";
import { CustomToggle } from "@/components/CustomUI";
import FieldEditor from "./Field";
import Relation from "./Relation";

interface Props {
  table: TableModal;
}
const Table = ({ table }: Props) => {
  const updateTable = useWorkspaceStore((state) => state.updateTable);
  const updateField = useWorkspaceStore((state) => state.updateField);
  const [isTitleEditing, setIsTitleEditing] = useState<boolean>(false);

  const onValueChange = useCallback(
    (fieldKey: string, fieldId: string) => (value: boolean | string) => {
      const oldField = table.fields.find((field) => field.id === fieldId);
      if (!oldField) return;
      updateField(table.id, { ...oldField, [fieldKey]: value });
    },
    [table.fields, updateField, table.id],
  );

  const onFieldNameChange = useCallback(
    (fieldId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const oldField = table.fields.find((field) => field.id === fieldId);
      if (!oldField) return;
      updateField(table.id, { ...oldField, name: e.target.value });
    },
    [updateField],
  );

  const onTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    updateTable({
      ...table,
      name: e.target.value,
    });
  };
  return (
    <>
      <CardHeader className="py-2">
        <CardTitle className="flex items-center">
          {isTitleEditing ? (
            <Input
              className="w-fit"
              defaultValue={table.name!}
              onChange={onTableNameChange}
              autoFocus
              onBlur={() => setIsTitleEditing(false)}
            />
          ) : (
            <>
              <p>{table.name}</p>
              <Button
                size="icon"
                variant="ghost"
                className="ml-1"
                onClick={() => setIsTitleEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {table.fields.map((field) => (
          <>
            <FieldEditor
              key={field.id}
              field={field}
              onValueChange={onValueChange}
              onFieldNameChange={onFieldNameChange}
            />
            {!!field.relations &&
              field.relations.map((relation) => (
                <Relation
                  key={relation.fieldId}
                  relation={relation}
                  tableId={table.id}
                  field={field}
                />
              ))}
          </>
        ))}
      </CardContent>
      <CardFooter>
        <Sheet.AddField tableId={table.id}>
          <Button className="w-full p-0">
            <ListPlus />
            Add
          </Button>
        </Sheet.AddField>
      </CardFooter>
    </>
  );
};

export default memo(Table);
