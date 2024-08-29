import { Field, FieldToggle, ToggleType } from "@/types/Table";
import { Badge } from "@/components/ui/badge";

const FieldInfoCard = ({ field }: { field: Field }) => {
  return (
    <div>
      <p>{field.name}</p>
      <p className="text-slate-400">{field.type}</p>
      <div className="flex flex-wrap gap-1">
        {Object.values(ToggleType).map((t) => (
          <Badge key={t} className="pt-1">
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FieldInfoCard;
