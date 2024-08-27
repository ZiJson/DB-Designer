import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropsWithChildren, useState } from "react";
import { FieldTypes } from "@/types/FieldTypes";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";

interface AddFieldProps extends PropsWithChildren {
  tableId: number;
}

const AddField = ({ children, tableId }: AddFieldProps) => {
  const addField = useWorkspaceStore((state) => state.addField);
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldTypes | null>(null);

  const onSubmit = () => {
    console.log(name, type);
    if (!name || !type) return;
    addField(tableId, name, type);
    setName("");
    setType(null);
  };
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Please Enter Some Info to Add a Field</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type as string}
              onValueChange={(t) => setType(t as FieldTypes)}
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
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" className="w-full" onClick={onSubmit}>
                Submit
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddField;
