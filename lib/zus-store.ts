import { CategoryType } from "@/app/(serverActions)/textDbPriceListActions";
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
  createdAt?: string;
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
        },
      };
    }),
  resetData: () => {
    set((state) => ({
      dynamicData: state.staticData,
      selected: {} as ProductSelectionData,
    }));
  },
}));
