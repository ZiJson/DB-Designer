import Image from "next/image";
import logo from "@/images/prismatrix.png";
import Link from "next/link";

const Logo = () => {
  return (
    <Link
      href="/"
      className="fixed left-8 top-5 flex items-center gap-2 text-2xl font-bold"
    >
      <Image src={logo} alt="logo" className="h-10 w-10"></Image>
      Prismatrix
    </Link>
  );
};

export default Logo;
