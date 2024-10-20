import { Card } from "@/components/ui/card";
import Image from "next/image";
import previewImage from "@/images/preview_light.png";
import ShineBorder from "@/components/ui/shine-border";

const PreviewImg = () => (
  <ShineBorder
    className="mx-auto mt-20 w-[80%] overflow-hidden rounded-2xl border bg-background p-0 [mask-image:linear-gradient(to_top,transparent_0%,#000_40%)] md:shadow-2xl"
    borderRadius={16}
    borderWidth={1.8}
    color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
  >
    <Image src={previewImage} alt="landing" />
  </ShineBorder>
);

export default PreviewImg;
