import { Fragment } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { CodeXml, MoonIcon, Scaling, Settings2, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Separator } from "@/components/ui/separator";
import ExportDialog from "./ExportDialog";

const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const toggleWidgetHide = useWorkspaceStore((state) => state.toggleWidgetHide);
  return (
    <Fragment>
      <Card className="absolute left-1/2 top-[20px] z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl p-2 shadow-lg transition-all">
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
        <Button variant="outline" size="icon" onClick={() => resizeCanvas()}>
          <Scaling className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        <ExportDialog />
        <Separator orientation="vertical" className="h-7" />
        <Toggle
          variant="outline"
          size="icon"
          pressed={useWorkspaceStore(
            (state) => !state.widgets["codeEditor"].hide,
          )}
          onClick={() => toggleWidgetHide("codeEditor")}
        >
          <CodeXml className="h-[1.2rem] w-[1.2rem]" />
        </Toggle>
        <Toggle
          variant="outline"
          size="icon"
          pressed={useWorkspaceStore(
            (state) => !state.widgets["noCodeEditor"].hide,
          )}
          onClick={() => toggleWidgetHide("noCodeEditor")}
        >
          <Settings2 className="h-[1.2rem] w-[1.2rem]" />
        </Toggle>
      </Card>
      {children}
    </Fragment>
  );
};

export default WidgetContainer;
