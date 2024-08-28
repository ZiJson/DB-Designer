import { ChevronLast } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}
const ExpandBtn = ({ isExpanded, setIsExpanded }: Props) => (
  <div
    className="absolute left-full top-[50%] z-10 flex h-20 w-8 translate-y-[-50%] cursor-pointer items-center justify-center rounded-r-lg bg-gray-50/70 shadow-lg transition-all hover:shadow-xl"
    onClick={() => setIsExpanded((pre) => !pre)}
  >
    <ChevronLast
      className={`${isExpanded ? "rotate-180" : ""} transition-all`}
    />
  </div>
);

export default ExpandBtn;
