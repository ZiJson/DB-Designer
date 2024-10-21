import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { LibraryBig } from "lucide-react";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { templates } from "./templates";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const TemplateDialog = () => {
  const startTemplate = useWorkspaceStore((state) => state.startTemplate);
  return (
    <div className="relative" onMouseMove={(e) => e.stopPropagation()}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="dock" size="dock" aria-label="templates">
            <LibraryBig className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-fit max-w-none">
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
            <DialogDescription>
              select a templates to jumpstart your project
            </DialogDescription>
          </DialogHeader>
          <ScrollArea>
            <div className="grid max-h-80 auto-rows-[6rem] grid-cols-3 gap-3">
              {Object.entries(templates).map(([key, value]) => (
                <DialogClose key={key} asChild>
                  <Card
                    className="cursor-pointer p-2 shadow-sm hover:bg-muted"
                    onClick={() => startTemplate(value)}
                  >
                    {key}
                  </Card>
                </DialogClose>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateDialog;
