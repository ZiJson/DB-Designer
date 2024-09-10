import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceStore } from "@/providers/workspace-store-provider";
import { TableModal } from "@/types/Table";

const TableCard = ({
  table,
  children,
  className,
}: {
  table: TableModal;
  children: React.ReactNode;
  className?: string;
}) => {
  const setActiveTableId = useWorkspaceStore((state) => state.setActiveTableId);
  const isDashboardOpen = useWorkspaceStore((state) => state.isDashboardOpen);
  return (
    <Card
      onClick={(e) => {
        e.stopPropagation();
        setActiveTableId(table.id);
      }}
      className={className}
    >
      {children}
    </Card>
  );
};

export default TableCard;
