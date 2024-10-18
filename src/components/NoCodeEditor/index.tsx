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
import ModelSection from "./Model/ModelSection";
import FieldSection from "./Model/FieldSection";
import EnumSection from "./Enum/EnumSection";
import ValueSection from "./Enum/ValueSection";

const NoCodeEditor = () => {
  const models = useWorkspaceStore((state) => state.models);
  const enums = useWorkspaceStore((state) => state.enums);
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const addNewField = useWorkspaceStore((state) => state.addNewField);
  const addNewTable = useWorkspaceStore((state) => state.addNewTable);
  const addNewEnum = useWorkspaceStore((state) => state.addNewEnum);
  const addNewEnumValue = useWorkspaceStore((state) => state.addNewEnumValue);
  const [editingValue, setEditingValue] = useState<string | null>(null);
  const [activeValue, setActiveValue] = useState("");

  useEffect(() => {
    if (editingValue !== null) {
      setTimeout(() => {
        document.querySelector(`item-${editingValue}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }, [editingValue]);

  const onValueChange = (value: string) => {
    setTimeout(() => {
      document.querySelector(`.item-${value}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
    setActiveValue(value);
    resizeCanvas(value);
    !value && setEditingValue(null);
    value !== editingValue && setEditingValue(null);
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
      <div className="w-full py-3">Models</div>
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
                  setEditingValue(bool ? model.name : null)
                }
                isEditing={editingValue === model.name}
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
                    isEditing={editingValue === model.name}
                  />
                </div>
              ))}
              {editingValue === model.name && (
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
      <div className="w-full pb-3 pt-4">Enums</div>

        {enums.map((enumData, enumIndex) => (
          <AccordionItem
            key={enumIndex}
            value={enumData.name}
            className={`group item-${enumData.name}`}
          >
            <AccordionTrigger className="py-3">
              <EnumSection enumIndex={enumIndex} onEdit={(bool: boolean) =>
                  setEditingValue(bool ? enumData.name : null)
                }
                isEditing={editingValue === enumData.name}
                onExpand={(bool: boolean) => {
                  setActiveValue(bool ? enumData.name : "");
                }} />
            </AccordionTrigger>
            <AccordionContent className="pl-5">
              {enumData.values.map((value, valueIndex) => (
                <div key={valueIndex} className="w-full border-t py-3">

              <ValueSection enumIndex={enumIndex} valueIndex={valueIndex} isEditing={editingValue === enumData.name}/>
                </div>
              ))}
              {editingValue === enumData.name && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => addNewEnumValue(enumData.name)}
                >
                  Add value
                </Button>
              )}
             </AccordionContent>
          </AccordionItem>
        ))}
        <Button
          variant="outline"
          className="mt-8 w-full"
          onClick={() => addNewEnum()}
        >
          Add Enum
        </Button>
      </Accordion>
    </div>
  );
};
export default NoCodeEditor;


