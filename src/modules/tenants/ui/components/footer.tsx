import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
export default function Footer() {
  return (
    <footer className="border-t bg-white font-medium ">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center gap-2 h-full px-4 py-6 lg:px-12">
        <p className="text-xl">Powered by</p>
        <Link href={process.env.NEXT_PUBLIC_APP_URL!}>
          <span className={cn("text-2xl font-semibold", poppins.className)}>
            mintpath
          </span>
        </Link>
      </div>
    </footer>
  );
}
