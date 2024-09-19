import { CustomToggle } from "@/components/CustomUI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldTypes } from "@/types/FieldTypes";
import { FieldToggle, type Field } from "@/types/Table";
import { memo } from "react";

interface Props {
  field: Field;
  onValueChange: (
    fieldKey: string,
    fieldId: string,
  ) => (value: boolean | string) => void;
  onFieldNameChange: (
    fieldId: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({
  field: { id, name, type, defaultValue, relations, ...toggleRest },
  onValueChange,
  onFieldNameChange,
}: Props) => {
  return (
    <div key={id} className="grid grid-cols-3 items-end gap-2">
      <div className="col-span-2 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={`name-${id}`}>Name</Label>
        <Input
          type="text"
          id={`name-${id}`}
          defaultValue={name}
          onChange={onFieldNameChange(id)}
          name={id}
        />
      </div>
      <div className="col-span-1 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={`type-${id}`}>Type</Label>
        <Select
          value={type}
          name={`type-${id}`}
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
      {/* <Button
        variant="destructive"
        size="icon"
        className="col-span-1 justify-self-end"
      >
        <Trash className="h-4 w-4" />
      </Button> */}
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
  );
};

export default memo(Field);
