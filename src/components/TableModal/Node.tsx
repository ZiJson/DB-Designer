import { useWorkspaceStore } from "@/providers/workspace-store-provider";

const Node = ({ tableId, fieldId }: { tableId: string; fieldId: string }) => {
  const setConnectingNode = useWorkspaceStore(
    (state) => state.setConnectingNode,
  );
  return (
    <i
      onMouseDown={(e) => {
        e.stopPropagation();
        setConnectingNode(tableId, fieldId);
      }}
      id={`${tableId}-${fieldId}`}
      className="absolute -right-[7px] top-[50%] h-3 w-3 translate-y-[-50%] rounded-full border-2 border-slate-600 bg-slate-100 hover:scale-125 hover:bg-slate-300"
    />
  );
};

export default Node;
