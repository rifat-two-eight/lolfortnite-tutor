import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            // Try to get token from multiple common locations
            let token = localStorage.getItem("accessToken");

            // If not found directly, try to get it from the Zustand auth-storage
            if (!token) {
                const authStorage = localStorage.getItem("auth-storage");
                if (authStorage) {
                    try {
                        const parsed = JSON.parse(authStorage);
                        token = parsed.state?.accessToken || null;
                    } catch (e) {
                        console.error("Error parsing auth-storage:", e);
                    }
                }
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Axios interceptor: Token found and attached to request");
            } else {
                console.warn("Axios interceptor: No token found in localStorage");
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
