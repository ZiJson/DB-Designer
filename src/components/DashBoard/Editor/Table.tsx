import { TableModal } from "@/types/Table";
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
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { set } from "react-hook-form";

interface Props {
  table: TableModal;
}
const Table = ({ table }: Props) => {
  const updateTable = useWorkspaceStore((state) => state.updateTable);
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    setNames(table.fields.map((field) => field.name));
  }, [table]);

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
    const fieldIndex = e.target.name.split("-").at(-1) as string;
    setNames((pre) =>
      pre.map((name, index) => {
        if (+fieldIndex !== index) return name;
        return value;
      }),
    );
  };

  const onValueChange =
    (fieldKey: string, fieldIndex: number) => (value: string) => {
      const newType = {
        name: value as FieldTypes,
      };
      onUpdateTable(fieldKey, fieldIndex, newType);
    };
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{table.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {table.fields.map((field, index) => (
          <div key={field.name} className="grid grid-cols-3 gap-2">
            <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log(names);
                  onUpdateTable("name", index, names[index]);
                }}
                className="group relative"
              >
                <Label htmlFor={`name-${table.id}-${index}`}>Name</Label>
                <Input
                  type="text"
                  value={names[index]}
                  id={`name-${table.id}-${index}`}
                  placeholder="Email"
                  onChange={onChange}
                  name={`name-${table.id}-${index}`}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-[50%] hidden translate-y-[-5%] group-focus-within:block"
                >
                  <Check className="rounded-full p-1 hover:bg-slate-200" />
                </button>
              </form>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor={`type-${table.id}-${index}`}>Type</Label>
              <Select
                value={field.type as string}
                name={`type-${table.id}-${index}`}
                onValueChange={onValueChange("type", index)}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Table;
