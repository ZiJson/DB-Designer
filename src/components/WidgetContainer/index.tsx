import { Fragment } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  CodeXml,
  MoonIcon,
  Redo2,
  Scaling,
  Settings2,
  SunIcon,
  Undo2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Separator } from "@/components/ui/separator";
import ExportDialog from "./ExportDialog";

const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const toggleWidgetHide = useWorkspaceStore((state) => state.toggleWidgetHide);
  const undo = useWorkspaceStore((state) => state.undo);
  const redo = useWorkspaceStore((state) => state.redo);
  const canUndo = useWorkspaceStore((state) =>
    state.history.length > 1 && state.currentIndex > 0
  );
  const canRedo = useWorkspaceStore((state) =>
    state.history.length > 1 && state.currentIndex < state.history.length - 1
  );
  return (
    <Fragment>
      <Card className="absolute left-1/2 top-[20px] z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl p-2 shadow-lg transition-all">
        <WidgetTooltip text="Theme">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </WidgetTooltip>
        <WidgetTooltip text="Resize canvas">
          <Button
            variant="outline"
            size="icon"
            onClick={() => resizeCanvas()}
            aria-label="resize canvas"
          >
            <Scaling className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </WidgetTooltip>
        <WidgetTooltip text="Export">
          <div>
            <ExportDialog />
          </div>
        </WidgetTooltip>
        <Separator orientation="vertical" className="h-7" />
        <WidgetTooltip text=" Code">
          <Toggle
            variant="outline"
            size="icon"
            pressed={useWorkspaceStore(
              (state) => !state.widgets["codeEditor"].hide,
            )}
            onClick={() => toggleWidgetHide("codeEditor")}
            aria-label="toggle code editor"
          >
            <CodeXml className="h-[1.2rem] w-[1.2rem]" />
          </Toggle>
        </WidgetTooltip>
        <WidgetTooltip text="Editor">
          <Toggle
            variant="outline"
            size="icon"
            pressed={useWorkspaceStore(
              (state) => !state.widgets["noCodeEditor"].hide,
            )}
            onClick={() => toggleWidgetHide("noCodeEditor")}
            aria-label="toggle no code editor"
          >
            <Settings2 className="h-[1.2rem] w-[1.2rem]" />
          </Toggle>
        </WidgetTooltip>
        <WidgetTooltip text="Undo">
          <Button
            variant="outline"
            size="icon"
            onClick={() => undo()}
            disabled={!canUndo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </WidgetTooltip>
        <WidgetTooltip text="Redo">
          <Button
            variant="outline"
            size="icon"
            onClick={() => redo()}
            disabled={!canRedo}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </WidgetTooltip>
      </Card>
      {children}
    </Fragment>
  );
};

export default WidgetContainer;

const WidgetTooltip = (
  { text, children }: { text: string; children: React.ReactNode },
) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent sideOffset={12}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
