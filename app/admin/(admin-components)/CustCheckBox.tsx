import { cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import React from "react";

type Props = {};

const CustCheckBox = ({
  onValueChange,
}: {
  onValueChange?: (isSelected: boolean) => void;
}) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const latestOnValueChange = React.useRef(onValueChange);

  React.useEffect(() => {
    latestOnValueChange.current = onValueChange;
  }, [onValueChange]);

  React.useEffect(() => {
    if (latestOnValueChange.current) latestOnValueChange.current(isSelected);
  }, [isSelected]);

  return (
    <Button
      radius="sm"
      onClick={() => setIsSelected((prev) => !prev)}
      className={cn(isSelected && "bg-accent/50", "h-[56px]")}
    >
      Bulk
    </Button>
  );
};

export default CustCheckBox;
