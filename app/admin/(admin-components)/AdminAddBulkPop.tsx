import {
  adminInsertListingBulk,
  adminUpdateListing,
} from "@/app/(serverActions)/adminActions";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { toast } from "sonner";
import { AdminBodyProductType, Selection } from "./AdminBodyShcn";

const AdminAddBulkPop = ({
  catId,
  setData,
  data,
  selectedKeys,
  setSelectedKeys,
}: {
  catId: number;
  setData: (value: React.SetStateAction<AdminBodyProductType>) => void;
  data: AdminBodyProductType;
  selectedKeys: Selection;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Selection>>;
}) => {
  // const [isOpen, setIsOpen] = React.useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [sortVal, setSortVal] = React.useState("1");
  const [textVal, setTextVal] = React.useState("");

  return (
    <div className="relative">
      <Button
        // startContent={<DelIcon />}
        className="h-[56px]"
        radius="sm"
        onPress={onOpen}
      >
        Add Bulk
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        size="lg"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Bulk Item
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1 text-zinc-300">
                  <p>Format: Product Name, Ori Price, Sale Price</p>
                  <p>Sale Price can be empty, e.g.:</p>
                  <p>Antec:</p>
                  <p>Intel, 2133, 1232</p>
                  <p>AMD, 5123</p>
                  <p>NVIDIA, 1551, 213</p>
                  {/* <p className="text-danger">Dont include labels</p> */}
                </div>
                <Input
                  label="Sort Value"
                  value={sortVal}
                  radius="sm"
                  onValueChange={setSortVal}
                />
                <Textarea
                  radius="sm"
                  minRows={200}
                  placeholder="Product Name, Ori Price, Sale Price"
                  onValueChange={setTextVal}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  isDisabled={textVal === "" || sortVal === ""}
                  className="bg-accent"
                  onPress={onClose}
                  onClick={() => {
                    toast.promise(
                      adminInsertListingBulk(
                        BigInt(catId),
                        Number(sortVal),
                        textVal,
                      ).then((products: any) => {
                        const productsSort = products.sort(
                          (a: any, b: any) => a.sort_val - b.sort_val,
                        );
                        let targetIndex = data.findIndex(
                          (item) => item.sort_val === productsSort[0].sort_val,
                        );

                        let updatedProducts = [
                          ...data.slice(0, targetIndex),
                          ...productsSort,
                          ...data.slice(targetIndex),
                        ];
                        // console.log(products);

                        const sortedProducts = updatedProducts.map(
                          (product, index) => ({
                            ...product,
                            sort_val: index + 1,
                          }),
                        );
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
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminAddBulkPop;
