import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(({ data }) => setUser(data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login: async (payload) => {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("assetflow_access", data.data.accessToken);
      setUser(data.data.user);
      toast.success("Welcome back");
    },
    signup: async (payload) => {
      const { data } = await api.post("/auth/signup", payload);
      toast.success(`${data.data.role} account saved. Check email verification.`);
    },
    logout: async () => {
      await api.post("/auth/logout").catch(() => null);
      localStorage.removeItem("assetflow_access");
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
