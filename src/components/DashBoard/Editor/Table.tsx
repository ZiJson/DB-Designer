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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldTypes } from "@/types/FieldTypes";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import {
  FocusEvent,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Check, ListPlus, Pencil } from "lucide-react";
import ToggleIcon from "./ToggleIcon";
import * as Sheet from "../../Sheets";
import { Button } from "@/components/ui/button";

interface Props {
  tableId: TableModal["id"];
}
const Table = ({ tableId }: Props) => {
  const table = useWorkspaceStore((state) =>
    state.tables.find((t) => t.id === tableId),
  )!;

  const updateTable = useWorkspaceStore((state) => state.updateTable);
  const updateField = useWorkspaceStore((state) => state.updateField);
  const [names, setNames] = useState<string[]>([]);
  const [tableName, setTableName] = useState<string | null>(null);

  // useEffect(() => {
  //   setNames(table.fields.map((field) => field.name));
  // }, [table]);

  const onUpdateTable = (fieldKey: string, fieldIndex: number, value: any) => {
    const newFields: TableModal["fields"] = table.fields.map((field, i) => {
      if (i === +fieldIndex) {
        return {
          ...field,
          [fieldKey]: value,
        };
      }
      return field;
    });
    const newTable: TableModal = {
      ...table,
      fields: newFields,
    };
    updateTable(newTable);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const fieldIndex = e.target.name.split("-").at(-1);
    if (!fieldIndex) return;
    setNames((pre) =>
      pre.map((name, index) => {
        if (+fieldIndex !== index) return name;
        return value;
      }),
    );
  };
  const onUpdateTableName = (
    e: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (!tableName) return;
    updateTable({
      ...table,
      name: tableName,
    });
    setTableName(null);
  };

  const onValueChange =
    (fieldKey: string, fieldIndex: number) => (value: string | boolean) => {
      onUpdateTable(fieldKey, fieldIndex, value as FieldTypes);
    };
  const onFieldNameChange = useCallback(
    (fieldId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      const oldField = table.fields.find((field) => field.id === fieldId);
      if (!oldField) return;
      updateField(tableId, { ...oldField, name: value });
    },
    [updateField],
  );
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          {tableName ? (
            <form onSubmit={onUpdateTableName} className="group relative">
              <Input
                className="w-fit"
                defaultValue={table.name!}
                onChange={(e) => setTableName(e.target.value)}
                onBlur={onUpdateTableName}
              />
              <button
                type="submit"
                className="absolute right-2 top-[50%] hidden translate-y-[-50%] group-focus-within:block"
              >
                <Check className="rounded-full p-1 hover:bg-slate-200" />
              </button>
            </form>
          ) : (
            <>
              <p>{table.name}</p>
              <Button
                size="icon"
                variant="ghost"
                className="ml-1"
                onClick={() => !tableName && setTableName(table.name)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {table.fields.map(
          ({ id, name, type, defaultValue, ...toggleRest }, fieldIndex) => (
            <div key={id} className="grid grid-cols-3 gap-2">
              <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`name-${table.id}-${fieldIndex}`}>Name</Label>
                <Input
                  type="text"
                  id={`name-${table.id}-${fieldIndex}`}
                  defaultValue={name}
                  onChange={onFieldNameChange(fieldIndex)}
                  name={`name-${table.id}-${fieldIndex}`}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor={`type-${table.id}-${fieldIndex}`}>Type</Label>
                <Select
                  value={type}
                  name={`type-${table.id}-${fieldIndex}`}
                  onValueChange={onValueChange("type", fieldIndex)}
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
                {Object.keys(toggleRest)
                  .reverse()
                  .map((item) => (
                    <TooltipProvider key={item}>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <div>
                            <Toggle
                              pressed={toggleRest[item as keyof FieldToggle]}
                              onPressedChange={onValueChange(item, fieldIndex)}
                            >
                              <ToggleIcon
                                toggleKey={item as ToggleType}
                                className="h-4 w-4"
                              />
                            </Toggle>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            </div>
          ),
        )}
        <Sheet.AddField tableId={table.id}>
          <Button className="w-full p-0">
            <ListPlus />
            Add
          </Button>
        </Sheet.AddField>
      </CardContent>
    </Card>
  );
};

export default memo(Table);
