import { FieldToggle, TableModal, ToggleType } from "@/types/Table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        {table.fields.map(({ id, name, type, defaultValue, ...toggleRest }) => (
          <div key={id} className="grid grid-cols-3 gap-2">
            <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor={`name-${table.id}-${id}`}>Name</Label>
              <Input
                type="text"
                id={`name-${table.id}-${id}`}
                defaultValue={name}
                onChange={onFieldNameChange(id)}
                name={`name-${table.id}-${id}`}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor={`type-${table.id}-${id}`}>Type</Label>
              <Select
                value={type}
                name={`type-${table.id}-${id}`}
                onValueChange={onValueChange("type", id)}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Basic Type</SelectLabel>
                    {Object.values(FieldTypes).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 flex justify-start gap-1">
              {Object.keys(toggleRest).map((item) => (
                <CustomToggle
                  key={item}
                  toggleKey={item}
                  pressed={toggleRest[item as keyof FieldToggle]}
                  onPressedChange={onValueChange(item, id)}
                  tooltipContent={item}
                />
              ))}
            </div>
          </div>
        ))}
        <Sheet.AddField tableId={table.id}>
          <Button className="w-full p-0">
            <ListPlus />
            Add
          </Button>
        </Sheet.AddField>
      </CardContent>
    </>
  );
};

export default memo(Table);
