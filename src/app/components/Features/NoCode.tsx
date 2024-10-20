"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";

const NoCode = () => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="absolute flex h-full w-full justify-between overflow-auto rounded-lg px-5 [mask-image:linear-gradient(to_top,transparent_40%,#000_90%)]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Accordion
        type="single"
        collapsible
        className="w-full scale-75 transition-all duration-300 group-hover:scale-[85%]"
        value={open ? "models" : ""}
      >
        <AccordionItem value="models">
          <AccordionTrigger className="cursor-default py-3">
            <div className="mr-3 flex h-full w-full items-center justify-between">
              <Badge variant="secondary" className="rounded-md">
                User
              </Badge>
              {/* 編輯和確認圖示的切換 */}
              <Button
                variant="ghost"
                size="icon"
                className="p-2 text-primary opacity-0 group-hover:opacity-80"
                asChild
              >
                <Settings className="h-4 w-4" aria-label="Confirm Edit" />
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-5">
            <div className="flex items-baseline justify-between border-t py-3">
              <Badge variant="secondary" className="rounded-md">
                id
              </Badge>
              <Badge variant="outline" className="rounded-md">
                Int
              </Badge>
            </div>
            <div className="flex items-baseline justify-between border-t py-3">
              <Badge variant="secondary" className="rounded-md">
                name
              </Badge>
              <Badge variant="outline" className="rounded-md">
                String
              </Badge>
            </div>
            <div className="flex items-baseline justify-between border-t py-3">
              <Badge variant="secondary" className="rounded-md">
                posts
              </Badge>
              <Badge variant="outline" className="rounded-md">
                Post
              </Badge>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="models2">
          <AccordionTrigger className="py-3">
            <div className="mr-3 flex h-full w-full items-center justify-between">
              <Badge variant="secondary" className="rounded-md">
                Post
              </Badge>
              {/* 編輯和確認圖示的切換 */}
              <Button
                variant="ghost"
                size="icon"
                className="p-2 text-primary opacity-0 group-hover:opacity-80"
                asChild
              >
                {/* <Settings className="h-4 w-4" aria-label="Confirm Edit" /> */}
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-5">
            <div className="flex items-baseline justify-between border-t py-3">
              <Badge variant="secondary" className="rounded-md">
                id
              </Badge>
              <Badge variant="outline" className="rounded-md">
                Int
              </Badge>
            </div>
            <div className="flex items-baseline justify-between border-t py-3">
              <Badge variant="secondary" className="rounded-md">
                title
              </Badge>
              <Badge variant="outline" className="rounded-md">
                String
              </Badge>
            </div>
            <div className="flex items-baseline justify-between border-t py-3">
              <Badge variant="secondary" className="rounded-md">
                authorId
              </Badge>
              <Badge variant="outline" className="rounded-md">
                Int
              </Badge>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NoCode;
