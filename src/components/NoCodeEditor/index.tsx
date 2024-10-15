import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Badge } from "../ui/badge";
import { DMMF } from "@prisma/generator-helper";
import { memo, useEffect, useState } from "react";
import { Check, Ellipsis, KeyRound, Settings } from "lucide-react";
import Editor from "./Editor";
import { on } from "events";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const NoCodeEditor = () => {
  const models = useWorkspaceStore((state) => state.models);
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log(editingIndex);
    if (editingIndex !== null) {
      console.log(editingIndex);
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
      >
        {models.map((model, modelIndex) => (
          <AccordionItem
            key={modelIndex}
            value={model.name}
            className={`group item-${models[modelIndex].name}`}
          >
            <AccordionTrigger>
              <ModelSection
                modelIndex={modelIndex}
                onEdit={(bool: boolean) =>
                  setEditingIndex(bool ? modelIndex : null)
                }
                isEditing={editingIndex === modelIndex}
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default NoCodeEditor;

interface ModelSectionProps {
  modelIndex: number;
  isEditing: boolean;
  onEdit: (bool: boolean) => void;
}
const ModelSection = ({ modelIndex, onEdit, isEditing }: ModelSectionProps) => {
  const model = useWorkspaceStore((state) => state.models[modelIndex]);
  const updateModelName = useWorkspaceStore((state) => state.updateModelName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updateModelName(model.name, newName); // 更新全域狀態
  };

  // 切換編輯模式
  const handleToggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
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
      <div onClick={handleToggleEdit}>
        {isEditing ? (
          <Check
            className="hidden h-4 w-4 text-primary/60 opacity-30 hover:opacity-100 group-hover:block"
            aria-label="Confirm Edit"
          />
        ) : (
          <Settings
            className="hidden h-4 w-4 text-primary/60 opacity-30 hover:opacity-100 group-hover:block"
            aria-label="Edit Model"
          />
        )}
      </div>
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    updateFieldName(modelName, field.name, newName); // 更新全域狀態
  };
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);

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
            <Toggle size="icon">
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
          <Select
            value={field.type}
            name="type"
            onValueChange={handleNormalChange}
          >
            <SelectTrigger className="w-30 h-auto py-1">
              <SelectValue placeholder="Select a Type" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectLabel>Scalar Type</SelectLabel>
                {scalarTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {" "}
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Model Type</SelectLabel>
                {objectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {" "}
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
