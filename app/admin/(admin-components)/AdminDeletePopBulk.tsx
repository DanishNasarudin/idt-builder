import { DelIcon } from "@/app/(main-components)/Icons";
import {
  adminDelListingBulk,
  adminUpdateListing,
} from "@/app/(serverActions)/adminActions";
import { sortProducts } from "@/lib/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";
import { AdminBodyProductType, Selection } from "./AdminBodyShcn";

const AdminDeletePopBulk = ({
  setData,
  data,
  selectedKeys,
  setSelectedKeys,
  rowsPerPage,
}: {
  setData: (value: React.SetStateAction<AdminBodyProductType>) => void;
  data: AdminBodyProductType;
  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;
  rowsPerPage: number | "Max";
}) => {
  // const [isOpen, setIsOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="relative">
      <Button
        isIconOnly
        color="danger"
        isDisabled={selectedKeys !== "all" && !(selectedKeys.size > 0)}
        startContent={<DelIcon />}
        className="h-[56px]"
        radius="sm"
        onPress={onOpen}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Item?
              </ModalHeader>
              <ModalBody>
                <p>Are you sure to delete the item?</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={onClose}
                  onClick={() => {
                    // console.log(item?.db_id);
                    if (selectedKeys === "all") {
                      if (rowsPerPage === "Max") {
                        const objToDelete = data.map((item) => item.id);
                        toast.promise(
                          adminDelListingBulk(objToDelete, true).then(() => {
                            setData([]);
                            setSelectedKeys(new Set([]));
                            onClose();
                          }),
                          {
                            loading: "Deleting...",
                            success: "Deleted!",
                            error: (data) => `Error: ${data}`,
                          },
                        );
                        return;
                      }
                      const objToDelete = data
                        .slice(0, rowsPerPage)
                        .map((item) => item.id);

                      toast.promise(
                        adminDelListingBulk(objToDelete).then(() => {
                          let deleteEntry = data.slice(
                            rowsPerPage,
                            data.length,
                          );

                          // console.log(deleteEntry);

                          deleteEntry = sortProducts(deleteEntry);
                          setData(deleteEntry);
                          setSelectedKeys(new Set([]));
                          // console.log(deleteEntry, "CHECK");

                          toast.promise(adminUpdateListing(deleteEntry), {
                            loading: "Updating...",
                            success: "Updated!",
                            error: (data) => `Error: ${data}`,
                          });
                          onClose();
                        }),
                        {
                          loading: "Deleting...",
                          success: "Deleted!",
                          error: (data) => `Error: ${data}`,
                        },
                      );
                      return;
                    }
                    const objToDelete = data
                      .filter((item) => selectedKeys.has(item.sort_val))
                      .map((item) => item.id);
                    // const keysToDelete: number[] = [...objToDelete] as number[];
                    // console.log(objToDelete);
                    toast.promise(
                      adminDelListingBulk(objToDelete).then(() => {
                        let deleteEntry = data.filter(
                          (p) => !selectedKeys.has(p.sort_val),
                        );

                        deleteEntry = sortProducts(deleteEntry);
                        setData(deleteEntry);
                        setSelectedKeys(new Set([]));

                        toast.promise(adminUpdateListing(deleteEntry), {
                          loading: "Updating...",
                          success: "Updated!",
                          error: (data) => `Error: ${data}`,
                        });
                        onClose();
                      }),
                      {
                        loading: "Deleting...",
                        success: "Deleted!",
                        error: (data) => `Error: ${data}`,
                      },
                    );
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminDeletePopBulk;
