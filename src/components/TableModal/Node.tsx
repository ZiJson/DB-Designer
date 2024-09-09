import { useWorkspaceStore } from "@/providers/workspace-store-provider";

const Node = ({ tableId, fieldId }: { tableId: number; fieldId: number }) => {
  // const { nodes, lines } = useWorkspaceStore((state) => state);
  // const nodeId = nodes.find(
  //   (node) => node.tableId === tableId && node.fieldId === fieldId,
  // )?.id;

  // if (!nodeId) return null;

  return (
    <i
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      id={`${tableId}-${fieldId}`}
      className="absolute -right-[7px] top-[50%] h-3 w-3 translate-y-[-50%] rounded-full border-2 border-slate-600 bg-slate-100 hover:scale-125 hover:bg-slate-300"
    />
  );
};

export default Node;
