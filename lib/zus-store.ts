import { CategoryType } from "@/services/textDbPriceListActions";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

type NavbarStore = {
  isOpen: boolean;
  isBuildPage: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsBuildPage: (isBuildPage: boolean) => void;
};

export const useNavbarStore = create<NavbarStore>()((set) => ({
  isOpen: true,
  isBuildPage: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsBuildPage: (isBuildPage) => set({ isBuildPage }),
}));

type TriggerStore = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
};

export const useTriggerStore = create<TriggerStore>()((set) => ({
  trigger: false,
  setTrigger: (trigger) => set({ trigger }),
}));

export type ProductItemSelectionData = CategoryType & {
  qty: number;
  sub_total: number;
  selected_id: number | undefined;
  duplicate?: boolean;
  discount?: number;
};

export type ProductSelectionData = {
  product_items: ProductItemSelectionData[];
  ori_total: number;
  grand_total: number;
  createdAt: string;
};

type FormDataItem = {
  category: string;
  selectedOption: { name: string; price: number };
  quantity: number;
  total: number;
};

export type QuoteData = {
  id: string;
  formData: FormDataItem[];
  grandTotal: number;
  oriTotal: number;
  createdAt: string;
  retainFormatData: ProductSelectionData;
};

type UserSelected = {
  dynamicData: ProductItemSelectionData[];
  staticData: ProductItemSelectionData[];
  initData: (newState: ProductItemSelectionData[]) => void;
  setData: (
    category_id: number,
    product_id: number | null,
    qty?: number
  ) => void;
  addData: (category_id: number) => void;
  delData: (category_id: number) => void;
  selected: ProductSelectionData;
  updateSelected: () => void;
  resetData: () => void;
  dataToQuote: () => QuoteData;
  quoteToData: (data: QuoteData) => void;
};

export const useUserSelected = create<UserSelected>()((set, get) => ({
  dynamicData: [],
  staticData: [],
  initData: (newState: ProductItemSelectionData[]) =>
    set(() => ({
      dynamicData: newState,
      staticData: newState,
    })),
  setData: (category_id, product_id, qty) =>
    set((state) => {
      const newData = state.dynamicData.map((item) => {
        if (item.category_id === category_id) {
          const calculate = item.products
            .filter((prod) => prod.product_id === product_id)
            .map((prod) => prod.dis_price * (qty ? qty : 1));
          const checkDis = item.products
            .filter((prod) => prod.product_id === Number(product_id))
            .map((prod) => prod.dis_price);

          return {
            ...item,
            qty: qty || 1,
            sub_total: calculate[0] ? calculate[0] : 0,
            discount: checkDis[0] ? checkDis[0] : 0,
            selected_id: product_id !== null ? Number(product_id) : undefined,
          };
        } else {
          return item;
        }
      }) as ProductItemSelectionData[];

      return { dynamicData: newData };
    }),
  addData: (category_id) =>
    set((state) => {
      const index = state.dynamicData.findIndex(
        (item) => item.category_id === category_id
      );

      if (index === -1) return state;

      const categoryToDuplicate = state.dynamicData[index];
      const newCategory: ProductItemSelectionData = JSON.parse(
        JSON.stringify(categoryToDuplicate)
      );

      const maxId = Math.max(
        ...state.dynamicData.map((item) => item.category_id)
      );
      newCategory.category_id = maxId + 1;
      newCategory.duplicate = true;

      const newData = [
        ...state.dynamicData.slice(0, index + 1),
        newCategory,
        ...state.dynamicData.slice(index + 1),
      ] as ProductItemSelectionData[];

      return { dynamicData: newData };
    }),
  delData: (category_id) =>
    set((state) => {
      const newData = state.dynamicData.filter(
        (item) => item.category_id !== category_id
      );

      return { dynamicData: newData };
    }),
  selected: {} as ProductSelectionData,
  updateSelected: () =>
    set(() => {
      const state = get();
      // const selectedProducts: ProductItemSelectionData[] = [];
      let oriTotal = 0;
      let grandTotal = 0;

      state.dynamicData.forEach((category) => {
        if (category.selected_id && category.qty && category.sub_total) {
          category.products.forEach((prod) => {
            if (prod.product_id === category.selected_id) {
              oriTotal += prod.is_discounted
                ? (prod.ori_price - prod.dis_price) * category.qty
                : 0;
              grandTotal += category.sub_total;
            }
          });
        }
      });

      const selectedProducts: ProductItemSelectionData[] = state.dynamicData
        .filter((category) => category.selected_id !== undefined)
        .map((category) => {
          const selectedProduct = category.products.find(
            (prod) => prod.product_id === category.selected_id
          );
          if (selectedProduct) {
            return {
              ...category,
              products: [selectedProduct],
            };
          }
          return undefined;
        })
        .filter((item): item is ProductItemSelectionData => item !== undefined);

      // console.log(selectedProducts, " CHECK");

      return {
        selected: {
          product_items: selectedProducts,
          ori_total: oriTotal + grandTotal,
          grand_total: grandTotal,
          createdAt: "",
        },
      };
    }),
  resetData: () => {
    set((state) => ({
      dynamicData: state.staticData,
      selected: {} as ProductSelectionData,
    }));
  },
  dataToQuote: () => {
    const { product_items, ori_total, grand_total } = get().selected;
    const createdAt = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const retainFormatData: ProductSelectionData = {
      product_items,
      ori_total,
      grand_total,
      createdAt,
    };

    const id = uuidv4();

    const selectedStore: QuoteData = {
      id,
      formData: product_items.map((item) => {
        return {
          category: item.category_name,
          selectedOption: {
            name: item.products[0].product_name,
            price: item.products[0].dis_price,
          },
          quantity: item.qty,
          total: item.sub_total,
        };
      }),
      grandTotal: grand_total,
      oriTotal: ori_total,
      createdAt: createdAt,
      retainFormatData,
    };

    return selectedStore;
  },
  quoteToData: (data) => {
    if (data === null) return;
    const parsedData: ProductSelectionData = data.retainFormatData;
    // console.log(parsedData, "pass1");

    set((state) => {
      let updatedData: ProductItemSelectionData[] = state.staticData.map(
        (cat) => ({
          ...cat,
          products: cat.products.map((prod) => ({ ...prod })),
        })
      ); // Start with a copy of savedData

      let processedProducts = new Set();
      let processedProductsCat = new Set();

      parsedData.product_items.forEach((selection) => {
        // Find the category index based on the product name
        const categoryIndex = updatedData.findIndex((category) =>
          category.products.some(
            (product) =>
              product.product_name === selection.products[0].product_name
          )
        );

        if (categoryIndex !== -1) {
          // Check if this category already has a different selected product
          const category: ProductItemSelectionData = updatedData[categoryIndex];
          const productId = category.products.find(
            (prod) => prod.product_name === selection.products[0].product_name
          )?.product_id;
          if (
            processedProducts.has(productId) ||
            processedProductsCat.has(categoryIndex)
          ) {
            // A different product is already selected in this category, so duplicate the category
            const newCategory: ProductItemSelectionData = JSON.parse(
              JSON.stringify(category)
            );
            const maxId =
              Math.max(...updatedData.map((c) => c.category_id), 0) + 1;
            newCategory.category_id = maxId;
            newCategory.duplicate = true;
            // Apply the selection to the new duplicated category
            applySelectionToCategory(newCategory, selection);
            updatedData.splice(categoryIndex + 1, 0, newCategory); // Insert the new category right after the original one
          } else {
            // Apply the selection directly to the existing category
            applySelectionToCategory(category, selection);
            updatedData[categoryIndex] = { ...category };
            processedProducts.add(productId);
            processedProductsCat.add(categoryIndex);
          }
        }
      });

      // console.log(updatedData, " CHECK zus");

      // console.log(parsedData, "DONE FILL");
      return { dynamicData: updatedData, selected: parsedData };
    });
  },
}));

function applySelectionToCategory(
  category: ProductItemSelectionData,
  selection: ProductItemSelectionData
) {
  category.products.forEach((product) => {
    if (product.product_name === selection.products[0].product_name) {
      category.qty = selection.qty;
      category.sub_total = product.dis_price
        ? product.dis_price * selection.qty
        : 0;
      category.discount = product.is_discounted ? product.dis_price : undefined;
      category.selected_id = product.product_id; // Assuming this needs to be set at the category level
    }
  });
}
