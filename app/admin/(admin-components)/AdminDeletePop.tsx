import { DelIcon } from "@/app/(main-components)/Icons";
import {
  adminDelListing,
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
import { AdminBodyProductType } from "./AdminBodyShcn";

const AdminDeletePop = ({
  item,
  setData,
  data,
  isDisabled,
}: {
  item: AdminBodyProductType[0];
  setData: (value: React.SetStateAction<AdminBodyProductType>) => void;
  data: AdminBodyProductType;
  isDisabled?: boolean;
}) => {
  // const [isOpen, setIsOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="relative">
      <Button
        isDisabled={isDisabled}
        color="danger"
        className=" flex h-[24px]
                    w-[24px] min-w-[24px] items-center justify-center rounded-md bg-transparent text-danger transition-all mobilehover:hover:bg-zinc-700"
        onPress={onOpen}
        startContent={<DelIcon size={16} />}
        isIconOnly
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
                <p>{item.product_name}</p>
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
                    if (item?.id === undefined) return;
                    toast.promise(
                      adminDelListing(item?.id).then(() => {
                        let deleteEntry = data.filter(
                          (p) => p?.id !== item?.id,
                        );

                        deleteEntry = sortProducts(deleteEntry);
                        setData(deleteEntry);

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

export default AdminDeletePop;
