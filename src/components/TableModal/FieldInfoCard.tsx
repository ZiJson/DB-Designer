import { Field, FieldToggle, ToggleType } from "@/types/Table";
import { Badge } from "@/components/ui/badge";

const FieldInfoCard = ({ field }: { field: Field }) => {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-1">
        <p className="scroll-m-20 text-xl font-semibold tracking-tight">
          {field.name}
        </p>
        <p className="text-slate-400">{field.type}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.values(ToggleType).map((t) => (
          <Badge
            key={t}
            className="pt-1"
            variant={field[t] ? "default" : "secondary"}
          >
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FieldInfoCard;
