import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function TooltipWrapper({
  children,
  content,
  side,
  align,
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={400}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "text-secondary-foreground z-[999]"
          )}
          side={side}
          align={align}
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
