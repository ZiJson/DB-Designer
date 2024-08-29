import { ToggleType } from "@/types/Table";
import { BoxSelect, Brackets, CircleHelp, Key, Pin } from "lucide-react";

const ToggleIcon = ({
  toggleKey,
  className,
}: {
  toggleKey: ToggleType;
  className?: string;
}) => {
  switch (toggleKey) {
    case ToggleType.PrimaryKey:
      return <Key className={className} />;
    case ToggleType.Nullable:
      return <BoxSelect className={className} />;
    case ToggleType.Unique:
      return <Pin className={className} />;
    case ToggleType.Array:
      return <Brackets className={className} />;
  }
};

export default ToggleIcon;
