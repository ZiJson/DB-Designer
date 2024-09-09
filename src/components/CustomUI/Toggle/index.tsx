import ToggleIcon from "@/components/CustomUI/Toggle/ToggleIcon";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  toggleKey: string;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  tooltipContent: string;
}
const CustomToggle = ({
  toggleKey,
  pressed,
  onPressedChange,
  tooltipContent,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger>
          <Toggle pressed={pressed} onPressedChange={onPressedChange}>
            <ToggleIcon toggleKey={toggleKey} className="h-4 w-4" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomToggle;
