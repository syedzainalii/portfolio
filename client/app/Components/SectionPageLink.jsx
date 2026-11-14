import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

export default function SectionPageLink({ href, label }) {
  return (
    <div className="flex justify-center">
      <Link
        href={href}
        className="relative group flex items-center gap-2 border border-gray-400 rounded-full px-10 py-3 mt-12 overflow-hidden transition-all duration-500 hover:-translate-y-1"
      >
        <span className="relative z-10 flex items-center gap-2 text-gray-700 group-hover:text-white dark:text-white dark:group-hover:text-black transition-colors duration-500">
          {label}
          <Image
            src={assets.right_arrow_bold}
            alt=""
            className="w-4 group-hover:invert"
          />
        </span>

        <span className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 dark:bg-white bg-black" />
      </Link>
    </div>
  );
}
