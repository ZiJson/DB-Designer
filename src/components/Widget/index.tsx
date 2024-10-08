import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

interface Props {
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
  isExpanded?: boolean;
  expandClassName?: string;
}
const Widget = ({
  children,
  className,
  side = "left",
  expandClassName,
  isExpanded,
}: Props) => {
  const [widgetSide, setWidgetSide] = useState(side);
  return (
    <Card
      className={`no-scrollbar fixed bottom-8 top-2/3 z-10 overflow-auto shadow-2xl transition-all duration-500 ease-out ${className} ${widgetSide === "left" ? "left-8" : "left-[calc(100%_-_2rem)] top-8 -translate-x-full"} ${isExpanded ? expandClassName : ""}`}
    >
      {children}
      <div className="absolute left-1/2 top-1/2 h-[105%] w-[105%] -translate-x-1/2 -translate-y-1/2 bg-primary" />
    </Card>
  );
};

export default Widget;
