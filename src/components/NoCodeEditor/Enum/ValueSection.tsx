
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import {   X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
interface ValueSectionProps {
  enumIndex: number;
  valueIndex: number;
  isEditing: boolean;
}

const ValueSection = ({
  enumIndex,
  valueIndex,
  isEditing,
}: ValueSectionProps) => {
  const enumName = useWorkspaceStore((state) => state.enums[enumIndex].name);
  const enumValue = useWorkspaceStore(
    (state) => state.enums[enumIndex].values[valueIndex],
  );
  const updateEnumValue = useWorkspaceStore(
    (state) => state.updateEnumValue,
  );
  const removeEnumValue = useWorkspaceStore(
    (state) => state.removeEnumValue,
  )
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updateEnumValue(enumName, enumValue.name, newName); // 更新全域狀態
  }
  return (
    <div className="flex h-full w-full items-center justify-between pr-1">
      {isEditing ? (
        <>
            <Input
              className="h-auto w-20 py-1"
              value={enumValue.name}
              onChange={handleNameChange}
            />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEnumValue(enumName, enumValue.name)}
            >
              <X className="h-4 w-4" />
            </Button>
        </>
      ) : (
        
          <Badge variant="secondary" className="rounded-md">
            {enumValue.name}
          </Badge>
        
      )}
    </div>
  );
};

export default ValueSection;