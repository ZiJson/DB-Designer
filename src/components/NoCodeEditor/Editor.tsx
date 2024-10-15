import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Settings, Undo2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface Props {
  modelName: string;
  onClose: () => void;
}

const Editor = ({ modelName, onClose }: Props) => {
  return (
    <div className="flex h-full w-full flex-col p-2">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <Undo2 className="h-4 w-4 text-primary" />
      </Button>
      <div className="flex items-center gap-3">
        Edit <Badge className="rounded-md text-sm">{modelName}</Badge>
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
      <Button type="submit">Save changes</Button>
    </div>
  );
};

export default Editor;
