import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { Badge } from "../ui/badge";
import { DMMF } from "@prisma/generator-helper";

const NoCodeEditor = () => {
  const models = useWorkspaceStore((state) => state.models);
  const resizeCanvas = useWorkspaceStore((state) => state.resizeCanvas);
  const onClick = (e: React.MouseEvent) => {
    (e.target as HTMLDivElement).scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="h-full w-full overflow-auto bg-card px-5 py-2">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        onValueChange={(value) => resizeCanvas(value)}
      >
        {models.map((model) => (
          <AccordionItem key={model.name} value={model.name} onClick={onClick}>
            <AccordionTrigger>
              <ModelSection model={model} />
            </AccordionTrigger>
            <AccordionContent className="pl-5">
              {model.fields.map((field) => (
                <div key={field.name} className="w-full border-t py-3">
                  <FieldSection field={field} />
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
  model: DMMF.Model;
}
const ModelSection = ({ model }: ModelSectionProps) => {
  return (
    <Badge variant="secondary" className="rounded-md">
      {model.name}
    </Badge>
  );
};

interface FieldSectionProps {
  field: DMMF.Field;
}

const FieldSection = ({ field }: FieldSectionProps) => {
  return (
    <div className="flex h-full w-full items-center justify-between">
      <Badge variant="secondary" className="rounded-md">
        {field.name}
      </Badge>
      <Badge variant="outline" className="rounded-md">
        {field.type}
      </Badge>
    </div>
  );
};
