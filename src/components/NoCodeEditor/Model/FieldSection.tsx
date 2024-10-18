import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Ellipsis, KeyRound, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ScalarTypes } from "@/types/Database";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
interface FieldSectionProps {
  modelIndex: number;
  fieldIndex: number;
  isEditing: boolean;
}

const FieldSection = ({
  modelIndex,
  fieldIndex,
  isEditing,
}: FieldSectionProps) => {
  const modelName = useWorkspaceStore((state) => state.models[modelIndex].name);
  const objectTypes = useWorkspaceStore((state) =>
    state.models.map((model) => model.name)
  );
  const field = useWorkspaceStore(
    (state) => state.models[modelIndex].fields[fieldIndex],
  );
  const updateFieldName = useWorkspaceStore((state) => state.updateFieldName);
  const updateModelField = useWorkspaceStore((state) => state.updateModelField);
  const removeField = useWorkspaceStore((state) => state.removeField);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updateFieldName(modelName, field.name, newName); // 更新全域狀態
  };

  const handleNormalChange = (value: string) => {
    updateModelField(modelName, field.name, { ...field, type: value }); // 更新全域狀態
  };

  const handleOptionChange = (key: string) => (value: boolean) => {
    updateModelField(modelName, field.name, { ...field, [key]: value }); // 更新全域狀態
  };

  return (
    <div className="flex h-full w-full items-center justify-between pr-1">
      {isEditing
        ? (
          <>
            <div className="flex items-center gap-2">
              <Input
                className="h-auto w-20 py-1"
                value={field.name}
                onChange={handleNameChange}
              />
              <Toggle
                size="icon"
                pressed={field.isId}
                onPressedChange={handleOptionChange("isId")}
              >
                <KeyRound className="h-4 w-4" />
              </Toggle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={field.isList}
                    onCheckedChange={handleOptionChange("isList")}
                  >
                    isList
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={field.isRequired}
                    onCheckedChange={handleOptionChange("isRequired")}
                  >
                    isRequired
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={field.isReadOnly}
                    onCheckedChange={handleOptionChange("isReadOnly")}
                  >
                    isReadOnly
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={field.isUnique}
                    onCheckedChange={handleOptionChange("isUnique")}
                  >
                    isUnique
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={field.type}
                name="type"
                onValueChange={handleNormalChange}
                disabled={field.kind === "object"}
              >
                <SelectTrigger className="w-30 h-auto py-1">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectGroup>
                    <SelectLabel>Scalar Type</SelectLabel>
                    {scalarTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Model Type</SelectLabel>
                    {objectTypes.map((type) => (
                      <SelectItem key={type} value={type} disabled>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(modelName, field.name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        )
        : (
          <>
            <Badge variant="secondary" className="rounded-md">
              {field.name}
            </Badge>
            <Badge variant="outline" className="rounded-md">
              {field.type}
            </Badge>
          </>
        )}
    </div>
  );
};

export default FieldSection;

const scalarTypes = Object.values(ScalarTypes);
