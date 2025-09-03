import { create } from "zustand";
import axios from "axios";

const Backend_uri = import.meta.env.VITE_BACKEND_URL;

const useStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,


  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${Backend_uri}/api/v1/signup`, userData);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message,
      });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },


  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${Backend_uri}/api/v1/signin`, credentials);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }


      set({
        token: res.data.token,
        user: res.data.user, 
        loading: false,
      });

      return res.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message,
      });
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${Backend_uri}/api/v1/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ user: res.data.user, loading: false });
      return res.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message,
      });
      return null;
    }
  },

  
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useStore;
