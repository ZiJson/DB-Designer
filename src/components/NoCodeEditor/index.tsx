import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Check, Ellipsis, KeyRound, Settings, Trash, X } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ScalarTypes } from "@/types/Database";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NoCodeEditor = () => {
  const models = useWorkspaceStore((state) => state.models);
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const addNewField = useWorkspaceStore((state) => state.addNewField);
  const addNewTable = useWorkspaceStore((state) => state.addNewTable);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeValue, setActiveValue] = useState("");

  useEffect(() => {
    if (editingIndex !== null) {
      setTimeout(() => {
        document.querySelector(`item-${editingIndex}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }, [editingIndex]);

  const onValueChange = (value: string) => {
    setTimeout(() => {
      document.querySelector(`.item-${value}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
    setActiveValue(value);
    resizeCanvas(value);
    const index = models.findIndex((model) => model.name === value);
    !value && setEditingIndex(null);
    index !== editingIndex && setEditingIndex(null);
  };
  return (
    <div className="flex h-full w-full justify-between overflow-auto bg-card px-5">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={onValueChange}
        value={activeValue}
      >
        {models.map((model, modelIndex) => (
          <AccordionItem
            key={modelIndex}
            value={model.name}
            className={`group item-${models[modelIndex].name}`}
          >
            <AccordionTrigger className="py-3">
              <ModelSection
                modelIndex={modelIndex}
                onEdit={(bool: boolean) =>
                  setEditingIndex(bool ? modelIndex : null)
                }
                isEditing={editingIndex === modelIndex}
                onExpand={(bool: boolean) => {
                  setActiveValue(bool ? model.name : "");
                }}
              />
            </AccordionTrigger>
            <AccordionContent className="pl-5">
              {model.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="w-full border-t py-3">
                  <FieldSection
                    modelIndex={modelIndex}
                    fieldIndex={fieldIndex}
                    isEditing={editingIndex === modelIndex}
                  />
                </div>
              ))}
              {editingIndex === modelIndex && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addNewField(model.name)}
                >
                  Add field
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
        <Button
          variant="outline"
          className="mt-8 w-full"
          onClick={() => addNewTable()}
        >
          Add Table
        </Button>
      </Accordion>
    </div>
  );
};
export default NoCodeEditor;

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
  const removeTable = useWorkspaceStore((state) => state.removeTable);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {isEditing ? (
        <Input
          className="h-auto w-24 py-1"
          value={model.name}
          onChange={handleNameChange}
        />
      ) : (
        <Badge variant="secondary" className="rounded-md">
          {model.name}
        </Badge>
      )}

      {/* 編輯和確認圖示的切換 */}
      {isEditing ? (
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
                onClick={() => removeTable(model.name)}
                variant="destructive"
                size="sm"
                className="w-fit"
              >
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
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
    state.models.map((model) => model.name),
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
      {isEditing ? (
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
      ) : (
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

const scalarTypes = Object.values(ScalarTypes);
