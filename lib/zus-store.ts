import { ProductPublicData } from "@/app/page";
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

type LoadingStore = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useLoadingStore = create<LoadingStore>()((set) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

type TriggerStore = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
};

export const useTriggerStore = create<TriggerStore>()((set) => ({
  trigger: false,
  setTrigger: (trigger) => set({ trigger }),
}));

export type Products = {
  product_category: string;
  product_name: string;
  price: number;
  qty: number;
  sub_total: number;
};

export type SelectedStore = {
  products: Products[];
  ori_total: number;
  grand_total: number;
  createdAt?: string;
};

type SelectStore = {
  data: ProductPublicData;
  savedData: ProductPublicData;
  selectedData: SelectedStore;
  initData: (newState: ProductPublicData) => void;
  setData: (
    category_id: number,
    product_id: string | null,
    qty?: number,
  ) => void;
  addData: (category_id: number) => void;
  delData: (category_id: number) => void;
  selected: () => SelectedStore;
  resetData: () => void;
  dataToJSON: () => string;
  JSONToData: (jsonString: string) => void;
  editData: (jsonString: string | null) => void;
};

export const useSelectStore = create<SelectStore>()((set, get) => ({
  data: [],
  savedData: [],
  selectedData: {} as SelectedStore,
  initData: (newState: ProductPublicData) =>
    set(() => ({ data: newState, savedData: newState })),
  setData: (category_id, product_id, qty) =>
    set((state) => {
      const newData = state.data.map((item) => {
        if (item.category_id === category_id) {
          const calculate = item.product
            .filter((prod) => prod.product_id === Number(product_id))
            .map((prod) => Number(prod.unit_price) * (qty ? qty : 1));
          const checkDis = item.product
            .filter((prod) => prod.product_id === Number(product_id))
            .map((prod) => prod.discount);

          return {
            ...item,
            qty: qty || null,
            sub_total: calculate[0] ? calculate[0] : 0,
            discount: checkDis[0] ? checkDis[0] : 0,
            selected_id: product_id !== null ? Number(product_id) : undefined,
          };
        } else {
          return item;
        }
      });
      return { data: newData };
    }),
  addData: (category_id) =>
    set((state) => {
      const index = state.data.findIndex(
        (item) => item.category_id === category_id,
      );

      if (index === -1) return state;

      const categoryToDuplicate = state.data[index];
      const newCategory: ProductPublicData[0] = JSON.parse(
        JSON.stringify(categoryToDuplicate),
      );

      const maxId = Math.max(...state.data.map((item) => item.category_id));
      newCategory.category_id = maxId + 1;
      newCategory.duplicate = true;

      const newData = [
        ...state.data.slice(0, index + 1),
        newCategory,
        ...state.data.slice(index + 1),
      ];

      return { data: newData };
    }),
  delData: (category_id) =>
    set((state) => {
      const newData = state.data.filter(
        (item) => item.category_id !== category_id,
      );
      return { data: newData };
    }),
  selected: () => {
    const state = get();
    const selectedProducts: Products[] = [];
    let oriTotal = 0;
    let grandTotal = 0;

    state.data.forEach((category) => {
      category.product.forEach((prod) => {
        if (
          prod.product_id === category.selected_id &&
          category.qty &&
          category.sub_total
        ) {
          selectedProducts.push({
            product_category:
              category.category_name === null ? "none" : category.category_name,
            product_name:
              prod.product_name === null ? "none" : prod.product_name,
            price: prod.unit_price === null ? 0 : prod.unit_price,
            qty: category.qty,
            sub_total: category.sub_total,
          });

          oriTotal += prod.discount ? prod.discount : 0;
          grandTotal += category.sub_total;
        }
      });
    });

    // set(() => {
    //   return {
    //     selectedData: {
    //       products: selectedProducts,
    //       ori_total: oriTotal + grandTotal,
    //       grand_total: grandTotal,
    //     },
    //   };
    // });

    return {
      products: selectedProducts,
      ori_total: oriTotal + grandTotal,
      grand_total: grandTotal,
    };
  },
  resetData: () => {
    set((state) => ({
      data: state.savedData,
    }));
  },
  dataToJSON: () => {
    const { products, ori_total, grand_total } = get().selected();
    const createdAt = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const selectedStore: SelectedStore = {
      products,
      ori_total,
      grand_total,
      createdAt,
    };

    return JSON.stringify(selectedStore);
  },
  JSONToData: (jsonString: string) => {
    const parsedData: SelectedStore = JSON.parse(jsonString);

    // if (parsedData !== "")
    set(() => {
      return {
        selectedData: parsedData,
      };
    });
    // return parsedData;
  },
  editData: (jsonString) => {
    if (jsonString === null) return;
    const parsedData: SelectedStore = JSON.parse(jsonString);

    set((state) => {
      let updatedData = state.savedData.map((cat) => ({
        ...cat,
        product: cat.product.map((prod) => ({ ...prod })),
      })); // Start with a copy of savedData

      let processedProducts = new Set();
      let processedProductsCat = new Set();

      parsedData.products.forEach((selection) => {
        // Find the category index based on the product name
        const categoryIndex = updatedData.findIndex((category) =>
          category.product.some(
            (product) => product.product_name === selection.product_name,
          ),
        );

        if (categoryIndex !== -1) {
          // Check if this category already has a different selected product
          const category: ProductPublicData[0] = updatedData[categoryIndex];
          const productId = category.product.find(
            (prod) => prod.product_name === selection.product_name,
          )?.product_id;
          if (
            processedProducts.has(productId) ||
            processedProductsCat.has(categoryIndex)
          ) {
            // A different product is already selected in this category, so duplicate the category
            const newCategory: ProductPublicData[0] = JSON.parse(
              JSON.stringify(category),
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

      return { data: updatedData, selectedData: { ...parsedData } };
    });
  },
}));

function applySelectionToCategory(
  category: ProductPublicData[0],
  selection: Products,
) {
  category.product.forEach((product) => {
    if (product.product_name === selection.product_name) {
      category.qty = selection.qty;
      category.sub_total = product.unit_price
        ? product.unit_price * selection.qty
        : null;
      category.discount = product.discount ? product.discount : undefined;
      category.selected_id = product.product_id; // Assuming this needs to be set at the category level
    }
  });
}
