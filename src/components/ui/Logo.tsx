import Image from "next/image";
import { cn } from "@/lib/utils";

/** Original logo extracted without alteration from the owner's brand guide. */
export default function Logo({ variant = "dark", className }: { variant?: "dark" | "light"; className?: string }) {
  return <span className={cn("inline-flex rounded-btn bg-white p-2", className)}>
    <Image src="/images/rayan-logo.jpg" alt="رایان دیجیتال — شریک رشد دیجیتال شما" width={3333} height={1378} className={variant === "light" ? "h-auto w-36" : "h-auto w-36 sm:w-44"} priority />
  </span>;
}
