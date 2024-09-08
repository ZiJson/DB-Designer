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
import { ArrowLeftRight } from "lucide-react";

interface AddFieldProps extends PropsWithChildren {
  tableId: number;
}

const AddField = ({ children, tableId }: AddFieldProps) => {
  const addNewField = useWorkspaceStore((state) => state.addNewField);
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldTypes | null>(null);

  const onSubmit = () => {
    if (!name || !type) return;
    addNewField(tableId, name, type);
    setName("");
    setType(null);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Please Enter Some Info to Add a Field</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-8 items-center gap-4">
            <Label htmlFor="name" className="col-span-2 text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-6"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-8 items-center gap-4">
            <Button
              size="icon"
              className="col-span-1 h-8 w-8 p-2"
              variant="ghost"
            >
              <ArrowLeftRight />
            </Button>
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type as string}
              onValueChange={(t) => setType(t as FieldTypes)}
            >
              <SelectTrigger id="type" className="col-span-6">
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
