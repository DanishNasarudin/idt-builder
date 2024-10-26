import { CategoryType } from "@/app/(serverActions)/textDbPriceListActions";
import { create } from "zustand";

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
  selected: ProductSelectionData;
  initData: (newState: ProductItemSelectionData[]) => void;
  setData: (
    category_id: number,
    product_id: number | null,
    qty?: number
  ) => void;
};

export const useUserSelected = create<UserSelected>()((set) => ({
  dynamicData: [],
  staticData: [],
  selected: {} as ProductSelectionData,
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
}));
