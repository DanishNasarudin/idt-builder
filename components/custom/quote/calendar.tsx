"use client";
import { Button } from "@/components/ui/button";
import { Calendar as UICalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { useMemo, useState } from "react";

type Props = {
  id: string;
  value?: Date;
  onValueChange?: (id: string, newValue: Date | undefined) => void;
  minDate?: Date;
};

export default function Calendar({
  id,
  value,
  onValueChange = () => {},
  minDate,
}: Props) {
  const initialDate = useMemo(() => value ?? new Date(), [value]);

  const [input, setInput] = useState<Date | undefined>(initialDate);
  const [dialog, setDialog] = useState(false);

  // useEffect(() => {
  //   setInput(value);
  // }, [value]);

  const handleChange = (e: Date | undefined) => {
    setInput(e);
    onValueChange(id, e);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(!input && "text-muted-foreground", "w-max")}
        >
          {input ? (
            format(input, "PPP", { locale: enGB })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 overflow-hidden pointer-events-auto"
        align="start"
      >
        <UICalendar
          mode="single"
          selected={input}
          onSelect={handleChange}
          defaultMonth={input}
          required
          disabled={(date) =>
            date < new Date("1900-01-01") || (minDate ? date < minDate : false)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
