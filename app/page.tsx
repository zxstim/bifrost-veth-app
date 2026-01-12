import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight text-balance">
        Bifrost Build Stack
      </h1>
      <p className="text-muted-foreground text-2xl">
        A kit to build with Bifrost protocol
      </p>
      <Button asChild>
        <Link href="/mint" className="w-fit">
          Mint <ArrowRight />
        </Link>
      </Button>
      <div className="my-4 border-t border-dashed border-muted-foreground" />
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
        Components
      </h2>
    </div>
  );
}
