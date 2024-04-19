"use client";
import { Button, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import AdminModalCategory from "./AdminModalCategory";

type Props = {
  className?: string;
  category: AdminCatProps;
};

export type AdminCatProps = (
  | {
      name?: string;
      link?: string;
      id: number;
      db_id?: number;
    }
  | undefined
)[];

const selections = [
  {
    name: "Intel CPU",
    link: "/admin/intel-cpu",
  },
  {
    name: "AMD CPU",
    link: "/admin/amd-cpu",
  },
  {
    name: "RAM",
    link: "/admin/ram",
  },
];

const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const AdminHead = ({ className, category }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const findMatch = category.find((item) => item?.link === pathname);

  const modalCategory = useDisclosure();

  return (
    <div className={`flex gap-4`}>
      <Select
        radius="sm"
        items={category}
        aria-label="select"
        defaultSelectedKeys={
          findMatch ? [findMatch.id !== null ? String(findMatch.id) : ""] : []
        }
      >
        {(item) => (
          <SelectItem
            key={String(item?.id)}
            onClick={() => {
              router.push(item?.link as string);
            }}
            aria-label={item?.name as string}
          >
            {item?.name as string}
          </SelectItem>
        )}
      </Select>
      <Button radius="sm" onClick={modalCategory.onOpen} className="px-[32px]">
        Edit Category
      </Button>
      <AdminModalCategory category={category} modalCategory={modalCategory} />
    </div>
  );
};

export default AdminHead;
