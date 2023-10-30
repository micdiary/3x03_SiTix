import { create } from "zustand";

export const eventStore = create((set) => ({
    eventData: [],
    setEventData: (data) => set({ eventData: data }),
}));

export const purchaseStore = create((set) => ({
    purchaseData: [],
    setPurchaseData: (data) => set({ purchaseData: data }),
}));
