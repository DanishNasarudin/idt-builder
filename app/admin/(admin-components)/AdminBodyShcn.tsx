"use client";

import {
  adminInsertListing,
  adminUpdateListing,
} from "@/app/(serverActions)/adminActions";
import Loading from "@/app/loading";
import { sortProducts } from "@/lib/utils";
import { useAdminStore, useAdminStoreChangeData } from "@/lib/zus-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import React, { Suspense } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import AdminAddBulkPop from "./AdminAddBulkPop";
import AdminBodyTable from "./AdminBodyTable";
import AdminDeletePopBulk from "./AdminDeletePopBulk";
import CustCheckBox from "./CustCheckBox";

type Props = {
  content: AdminBodyType;
};

export type AdminBodyType = {
  id: number;
  product: AdminBodyProductType;
};

export type AdminBodyProductType = {
  id: number;
  sort_val: number;
  product_name: string | null;
  ori_price: number | null;
  dis_price: number | null;
  is_available: boolean | null;
  is_label: boolean | null;
  is_soldout: boolean;
  hidden?: boolean;
}[];

export const listContext = React.createContext<{
  setSize: (index: number, size: number) => void;
}>({ setSize: () => {} });

export type Selection = "all" | Set<React.Key>;

function findUpdatedItems(
  originalItems: AdminBodyProductType,
  currentItems: AdminBodyProductType,
) {
  const updatedItems = currentItems.filter((currentItem) => {
    const originalItem = originalItems.find(
      (oItem) => oItem?.id === currentItem?.id,
    );

    // If an item with the same ID is not found, it's a new item (or handle accordingly)
    if (!originalItem) return false;

    return (
      originalItem.dis_price !== currentItem?.dis_price ||
      originalItem.is_available !== currentItem?.is_available ||
      originalItem.is_label !== currentItem?.is_label ||
      originalItem.ori_price !== currentItem?.ori_price ||
      originalItem.product_name !== currentItem?.product_name ||
      originalItem.sort_val !== currentItem?.sort_val ||
      originalItem.is_soldout !== currentItem?.is_soldout
    );
  });

  return updatedItems;
}

const AdminBodyShcn = ({ content }: Props) => {
  const {
    selectColumn,
    setSelectColumn,
    selectedKeys,
    setSelectedKeys,
    setRowsPerPage,
  } = useAdminStore();

  const { changeData, initChangeData } = useAdminStoreChangeData();

  // Handle adding product --------------------------------------------------
  const schema = z.object({
    sort_val: z.string(),
    product_name: z.string(),
  });

  type ListAddFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ListAddFields>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<ListAddFields> = async (formData) => {
    toast.promise(
      adminInsertListing(
        BigInt(content.id),
        Number(formData.sort_val),
        formData.product_name,
      ).then((dataId: any) => {
        // console.log(dataId, "CHECK");

        const newProduct = {
          id: dataId,
          sort_val: Number(formData.sort_val),
          product_name: formData.product_name,
          ori_price: null,
          dis_price: null,
          is_available: true,
          is_label: false,
          is_soldout: false,
        };

        let updatedProducts = [...content.product, newProduct];

        const sortedProducts = sortProducts(updatedProducts);

        // setData(sortedProducts);
        initChangeData(sortedProducts);
        // console.log(sortedProducts);
        toast.promise(adminUpdateListing(sortedProducts), {
          loading: "Updating...",
          success: "Updated!",
          error: (data) => `Error: ${data}`,
        });
      }),
      {
        loading: "Adding...",
        success: "Added!",
        error: (data) => `Error: ${data}`,
      },
    );
  };

  React.useEffect(() => {
    initChangeData(content.product);
  }, [content]);

  const [searchVal, setSearchVal] = React.useState("");

  const [searchDeb] = useDebounce(searchVal, 500);

  // console.log(changeData, "check");

  return (
    <div>
      {/* <DragSelection /> */}
      <div id="drag-table" className="relative">
        <div className="sticky top-4 z-[50] flex flex-col gap-2">
          <div>
            <Input
              classNames={{
                inputWrapper: "bg-[rgb(15,15,15)]",
              }}
              radius="sm"
              variant="bordered"
              label="Search Products"
              // className="max-w-[180px]"
              value={searchVal}
              onValueChange={setSearchVal}
              isClearable
            />
          </div>
          <div className="flex gap-2 bg-[rgb(15,15,15)]">
            <CustCheckBox
              onValueChange={async (e) => {
                setRowsPerPage(30);
                setSelectColumn(e);
                // setSearchVal("");
                // localStorage.setItem("admin-bulk-edit", `${e}`);
                // window.dispatchEvent(new Event("storage"));
                // setColumnVisibility((prev) => ({
                //   ...prev,
                //   ["select"]: !prev["select"],
                // }));
                setSelectedKeys(new Set([]));
              }}
            />
            {selectColumn ? (
              <>
                <AdminDeletePopBulk
                  // setData={setData}
                  data={content.product}
                  selectedKeys={selectedKeys}
                  // setSelectedKeys={setSelectedKeys}
                  // rowsPerPage={rowsPerPage}
                />
                <AdminAddBulkPop
                  catId={content.id}
                  // setData={setData}
                  data={content.product}
                  // selectedKeys={selectedKeys}
                  // setSelectedKeys={setSelectedKeys}
                />
                <Button
                  radius="sm"
                  isDisabled={
                    findUpdatedItems(content.product, changeData).length === 0
                  }
                  onClick={() => {
                    const update = findUpdatedItems(
                      content.product,
                      changeData,
                    );
                    // console.log(update);
                    toast.promise(adminUpdateListing(update), {
                      loading: "Updating...",
                      success: "Updated!",
                      error: (data) => `Error: ${data}`,
                    });
                  }}
                  className={`${
                    findUpdatedItems(content.product, changeData).length > 0
                      ? "bg-accent"
                      : ""
                  }  h-[56px]`}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <form
                  className="flex w-full gap-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    {...register("sort_val")}
                    classNames={{
                      inputWrapper: "",
                    }}
                    radius="sm"
                    variant="bordered"
                    label="Sort Value"
                    className="max-w-[180px]"
                  />
                  <Input
                    {...register("product_name")}
                    classNames={{
                      inputWrapper: "",
                    }}
                    radius="sm"
                    variant="bordered"
                    label="Product Name"
                  />
                  <Button
                    type="submit"
                    radius="sm"
                    className="h-[56px] px-[40px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Product"}
                  </Button>
                </form>
                <Button
                  radius="sm"
                  isDisabled={
                    findUpdatedItems(content.product, changeData).length === 0
                  }
                  onClick={() => {
                    const update = findUpdatedItems(
                      content.product,
                      changeData,
                    );
                    // console.log(update);
                    toast.promise(adminUpdateListing(update), {
                      loading: "Updating...",
                      success: "Updated!",
                      error: (data) => `Error: ${data}`,
                    });
                  }}
                  className={`${
                    findUpdatedItems(content.product, changeData).length > 0
                      ? "bg-accent"
                      : ""
                  }  h-[56px]`}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <AdminBodyTable
            dataInit={content.product}
            searchVal={searchDeb}
            setSearchVal={setSearchVal}
          />
        </Suspense>
      </div>
    </div>
  );
};

// const AdminBodyShcnBlock = block(AdminBodyShcn);

export default AdminBodyShcn;
