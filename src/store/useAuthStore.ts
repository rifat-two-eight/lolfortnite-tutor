import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string;
    phone?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ accessToken: token }),
            logout: () => {
                set({ user: null, accessToken: null });
                localStorage.removeItem("accessToken");
            },
        }),
        {
            name: "auth-storage",
        }
    )
);
