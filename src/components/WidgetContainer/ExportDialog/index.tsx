import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { convertDMMFToPrismaSchema } from "@/lib/tools";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Copy, Download } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import { Card } from "@/components/ui/card";

const ExportDialog = () => {
  const errors = useWorkspaceStore((state) => state.errors);
  const schema = useWorkspaceStore((state) =>
    convertDMMFToPrismaSchema({ models: state.models, enums: state.enums }),
  );
  console.log(schema);
  const handleCopy = () => {
    navigator.clipboard.writeText(schema);
    toast.success("copied to clipboard");
  };
  return (
    <div className="relative">
      {!!errors.length && (
        <div className="absolute -right-1 -top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-sm">
          {errors.length}
        </div>
      )}
      <Dialog>
        <DialogTrigger asChild disabled={!!errors.length}>
          <Button variant="dock" size="dock" aria-label="Export">
            <Download className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-fit max-w-none">
          <DialogHeader>
            <DialogTitle>Your Prisma Schema</DialogTitle>
            <DialogDescription>
              copy it to your schema.prisma in your project
            </DialogDescription>
          </DialogHeader>
          <Card className="relative">
            <CodeEditor
              readOnly
              basicSetup={{ foldGutter: false, lineNumbers: false }}
              value={schema}
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute right-1 top-1"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportDialog;
