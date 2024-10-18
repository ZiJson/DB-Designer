import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { memo, useState } from "react";
import { Check, Settings, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ModelSectionProps {
  modelIndex: number;
  isEditing: boolean;
  onEdit: (bool: boolean) => void;
  onExpand: (bool: boolean) => void;
}
const ModelSection = ({
  modelIndex,
  onEdit,
  isEditing,
  onExpand,
}: ModelSectionProps) => {
  const model = useWorkspaceStore((state) => state.models[modelIndex]);
  const updateModelName = useWorkspaceStore((state) => state.updateModelName);
  const removeModel = useWorkspaceStore((state) => state.removeModel);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newName = e.target.value;
    updateModelName(model.name, newName); // 更新全域狀態
  };

  // 切換編輯模式
  const handleToggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onExpand(!isEditing);
    onEdit(!isEditing);
  };

  return (
    <div className="mr-3 flex h-full w-full items-center justify-between">
      {isEditing
        ? (
          <Input
            className="h-auto w-24 py-1"
            value={model.name}
            onChange={handleNameChange}
            onClick={(e) => e.stopPropagation()}
          />
        )
        : (
          <Badge variant="secondary" className="rounded-md">
            {model.name}
          </Badge>
        )}

      {/* 編輯和確認圖示的切換 */}
      {isEditing
        ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-primary opacity-30 hover:opacity-100"
              onClick={handleToggleEdit}
              asChild
            >
              <Check className="h-4 w-4" aria-label="Confirm Edit" />
            </Button>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-primary opacity-30 hover:opacity-100"
                  asChild
                  onClick={(e) => {
                    e.preventDefault();
                    setPopoverOpen((pre) => !pre);
                  }}
                >
                  <Trash className="h-4 w-4" aria-label="Confirm Edit" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col items-end gap-2">
                Do you want to delete this table?
                <Button
                  onClick={() => removeModel(model.name)}
                  variant="destructive"
                  size="sm"
                  className="w-fit"
                >
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        )
        : (
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-primary opacity-0 group-hover:opacity-80"
            onClick={handleToggleEdit}
            asChild
          >
            <Settings className="h-4 w-4" aria-label="Confirm Edit" />
          </Button>
        )}
    </div>
  );
};

export default memo(ModelSection);
