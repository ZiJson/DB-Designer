import { Fragment } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "../ui/button";
import { CodeXml, Redo2, Scaling, Settings2, Undo2 } from "lucide-react";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Separator } from "@/components/ui/separator";
import ExportDialog from "./ExportDialog";
import { Dock, DockIcon } from "@/components/ui/dock";
import TemplateDialog from "./TemplateDialog";

const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const toggleWidgetHide = useWorkspaceStore((state) => state.toggleWidgetHide);
  const undo = useWorkspaceStore((state) => state.undo);
  const redo = useWorkspaceStore((state) => state.redo);
  const canUndo = useWorkspaceStore(
    (state) => state.history.length > 1 && state.currentIndex > 0,
  );
  const canRedo = useWorkspaceStore(
    (state) =>
      state.history.length > 1 && state.currentIndex < state.history.length - 1,
  );
  return (
    <Fragment>
      <TooltipProvider>
        <Dock
          direction="middle"
          distance={100}
          className="absolute left-1/2 top-5 z-30 mt-0 -translate-x-1/2"
        >
          <DockIcon>
            <WidgetTooltip text="Templates">
              <TemplateDialog />
            </WidgetTooltip>
          </DockIcon>
          <DockIcon>
            <WidgetTooltip text="Resize canvas">
              <Button
                variant="dock"
                size="dock"
                onClick={() => resizeCanvas()}
                aria-label="resize canvas"
              >
                <Scaling className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </WidgetTooltip>
          </DockIcon>
          <DockIcon>
            <WidgetTooltip text="Export">
              <div>
                <ExportDialog />
              </div>
            </WidgetTooltip>
          </DockIcon>
          <Separator orientation="vertical" className="h-7" />
          <DockIcon>
            <WidgetTooltip text=" Code">
              <Toggle
                variant="dock"
                size="dock"
                pressed={useWorkspaceStore(
                  (state) => !state.widgets["codeEditor"].hide,
                )}
                onClick={() => toggleWidgetHide("codeEditor")}
                aria-label="toggle code editor"
              >
                <CodeXml className="h-[1.2rem] w-[1.2rem]" />
              </Toggle>
            </WidgetTooltip>
          </DockIcon>
          <DockIcon>
            <WidgetTooltip text="Editor">
              <Toggle
                variant="dock"
                size="dock"
                pressed={useWorkspaceStore(
                  (state) => !state.widgets["noCodeEditor"].hide,
                )}
                onClick={() => toggleWidgetHide("noCodeEditor")}
                aria-label="toggle no code editor"
              >
                <Settings2 className="h-[1.2rem] w-[1.2rem]" />
              </Toggle>
            </WidgetTooltip>
          </DockIcon>
          <DockIcon>
            <WidgetTooltip text="Undo">
              <Button
                variant="dock"
                size="dock"
                onClick={() => undo()}
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </WidgetTooltip>
          </DockIcon>
          <DockIcon>
            <WidgetTooltip text="Redo">
              <Button
                variant="dock"
                size="dock"
                onClick={() => redo()}
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </WidgetTooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
      {/* <Card className="absolute left-1/2 top-[20px] z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl p-2 shadow-lg transition-all">
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
      </Card> */}
      {children}
    </Fragment>
  );
};

export default WidgetContainer;

const WidgetTooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={12}>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};
