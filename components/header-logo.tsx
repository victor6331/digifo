import Image from "next/image";
import Link from "next/link";

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex">
        <Image src="/logo.svg" alt="Logo" height={80} width={80} />
        <p className="font-semibold text-white text-2xl ml-2.5">Digifo</p>
      </div>
    </Link>
  );
};
