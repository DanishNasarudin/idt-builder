"use client";

import { useNavbarStore } from "@/lib/zus-store";

type SideBarType = {
  children: React.ReactNode;
  className?: string;
  openSize?: number;
  closeSize?: number;
};

const SideNavbarContent = ({
  children,
  className,
  openSize,
  closeSize,
}: SideBarType) => {
  const { isOpen } = useNavbarStore();
  return (
    <>
      {!isOpen ? (
        <div className="flex">
          <div
            className={`${openSize ? `w-[${openSize}px]` : `w-[260px]`}`}
          ></div>
          <div className={className}>{children}</div>
        </div>
      ) : (
        <div className="flex">
          <div
            className={`${closeSize ? `w-[${closeSize}px]` : `w-[90px]`}`}
          ></div>
          <div className={className}>{children}</div>
        </div>
      )}
    </>
  );
};

export default SideNavbarContent;
