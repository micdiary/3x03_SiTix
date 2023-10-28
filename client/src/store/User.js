import { create } from "zustand";

export const userStore = create((set) => ({
    token: null,
    userType: null,
    setToken: (id) => set((_) => ({ token: id })),
    setUserType: (type) => set((_) => ({ userType: type })),
    removeUser: () => set((_) => ({ token: null, userType: null })),
}));

export const eventStore = create((set) => ({
    eventData: [],
    venueData: [],
    seatType: [],
    seatData: [],
    setEventData: (data) => set({ eventData: data }),
    setVenueData: (data) => set({ venueData: data }),
    setSeatType: (data) => set({ seatType: data }),
    setSeatData: (data) => set({ seatData: data }),
}));
