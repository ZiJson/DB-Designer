import TextRevealByWord from "@/components/ui/text-reveal";
import GridCard from "./GridCard";
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Redo, Redo2, Share2Icon, Sparkles } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import GridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Code from "./Code";
import UndoRedo from "./UndoRedo";
import NoCode from "./NoCode";
import WidgetDemo from "./WIdgetDemo";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import Linting from "./Linting";

const features = [
  {
    name: "Clean, Intuitive Interface",
    description:
      "Use drag-and-drop tables for a clear and simple way to visualize and build your database structure.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    background: (
      <GridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:linear-gradient(to_top,transparent_40%,#000_90%)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 transition-all duration-300 group-hover:scale-105",
        )}
      />
    ),
  },
  {
    name: "Flexible Workspace",
    description:
      "Operate without worrying about screen space—adjustable tool windows allow smooth schema editing without interfering with your canvas size.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4",
    background: <WidgetDemo />,
  },
  {
    name: "Code Editor",
    description: "Supports 100+ integrations and counting.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    background: <Code />,
  },
  {
    name: "Undo & Redo",
    description:
      "Make changes confidently with full undo and redo capabilities for all actions.",
    className:
      "col-span-3 lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4  transition-all",
    href: "#",
    cta: "Learn more",
    background: <UndoRedo />,
  },
  {
    name: "Code Free",
    description:
      "Rely on official Prisma lint checks for safety, with detailed error messages guiding you through corrections.",
    href: "#",
    cta: "Learn more",
    className:
      "col-span-3 lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
    background: <NoCode />,
  },
  {
    name: "Built-in Linting",
    description:
      "Rely on official Prisma lint checks for safety, with detailed error messages guiding you through corrections.",
    className: "col-span-3 lg:col-span-2 lg:row-span-2",
    href: "#",
    cta: "Learn more",
    background: <Linting />,
  },
  {
    name: "Several Templates",
    description:
      "Choose from predefined templates or import your own schema to jumpstart your project.",
    className: "col-span-3 lg:col-span-1 lg:row-span-2",
    href: "#",
    cta: "Learn more",
    background: (
      <VelocityScroll
        text="Blog E-commerce Q&A Tasks"
        default_velocity={3}
        className="font-display mt-4 text-center text-4xl font-bold tracking-[-0.02em] text-black opacity-50 drop-shadow-sm transition-all group-hover:opacity-75 dark:text-white md:text-6xl md:leading-[4rem]"
      />
    ),
  },
];

const Features = () => {
  return (
    <BentoGrid className="mx-auto mt-36 max-w-6xl auto-rows-[10rem]">
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
};

export default Features;
