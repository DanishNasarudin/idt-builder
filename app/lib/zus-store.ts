import { create } from "zustand";
import { QuoteData } from "../quote/[id]/page-new";

type UserSelected = {
  selected: QuoteData;
  changeSelected: (selected: QuoteData) => void;
};

export const useUserSelected = create<UserSelected>()((set) => ({
  selected: {
    id: "0",
    formData: [],
    createdAt: "",
    grandTotal: 0,
    oriTotal: 0,
  },
  changeSelected: (selected: QuoteData) =>
    set((state) => {
      console.log(selected, "ZUS");

      return { selected };
    }),
}));
