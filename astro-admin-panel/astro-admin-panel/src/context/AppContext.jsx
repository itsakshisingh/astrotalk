import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { PENDING_ASTROLOGERS, ALL_ASTROLOGERS, APPOINTMENTS, PRODUCTS } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Restore auth state from localStorage if available
  const [token, setToken] = useState(() => localStorage.getItem("jyotish_token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("jyotish_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pending, setPending] = useState(PENDING_ASTROLOGERS);
  const [astrologers, setAstrologers] = useState(ALL_ASTROLOGERS);
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Derived role: 'superadmin' | 'astrologer' | 'user' | null
  const rawRole = user?.role;
  const role = rawRole === "super_admin" || rawRole === "superadmin" ? "superadmin" : rawRole || null;

  // Fetch all dashboard data from live backend
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Pending Astrologers
      try {
        const pendingRes = await api.get("/admin/astrologers/pending");
        if (pendingRes.data?.success && Array.isArray(pendingRes.data.data)) {
          setPending(
            pendingRes.data.data.map((item) => ({
              id: item._id,
              name: item.fullName,
              email: item.email,
              specialization: item.specialization || "Vedic Astrology",
              experience: item.experience || 0,
              submitted: "Recently",
            }))
          );
        }
      } catch (err) {
        console.warn("Could not fetch pending astrologers from backend, using current state.");
      }

      // 2. Fetch All Astrologers
      try {
        const allRes = await api.get("/admin/astrologers");
        if (allRes.data?.success && Array.isArray(allRes.data.data)) {
          setAstrologers(
            allRes.data.data.map((item) => ({
              id: item._id,
              name: item.fullName,
              email: item.email,
              specialization: item.specialization || "Vedic Astrology",
              experience: item.experience || 5,
              rating: item.rating || 4.8,
              sessions: item.sessions || 100,
              status: item.status || "active",
            }))
          );
        }
      } catch (err) {
        console.warn("Could not fetch all astrologers from backend, using current state.");
      }

      // 3. Fetch Appointments
      // Astrologer ke liye: sirf unki appointments, Admin ke liye: saari appointments
      try {
        // Get fresh user data to determine astrologer ID
        const savedUser = localStorage.getItem("jyotish_user");
        const currentUser = savedUser ? JSON.parse(savedUser) : null;
        const currentRole = currentUser?.role;
        const isAstrologer = currentRole === "astrologer";
        const astroId = currentUser?._id || currentUser?.id;

        const appointEndpoint = isAstrologer && astroId
          ? `/appointments/astrologer/${astroId}`
          : "/appointments";

        const appointRes = await api.get(appointEndpoint);
        if (appointRes.data?.success && Array.isArray(appointRes.data.data)) {
          setAppointments(
            appointRes.data.data.map((item) => ({
              id: item._id,
              user: item.fullName || item.userId?.fullName || "Client",
              email: item.email || "",
              phone: item.phone || "",
              astrologer: item.astrologerName || item.astrologerId?.fullName || "Expert Astrologer",
              astrologerId: item.astrologerId?._id || item.astrologerId || null,
              date: item.appointmentDate,
              time: item.appointmentTime,
              mode: item.service || "Consultation",
              message: item.message || "",
              amount: 799,
              status: item.status || "pending",
            }))
          );
        }
      } catch (err) {
        console.warn("Could not fetch appointments from backend, using current state.");
      }

      // 4. Fetch Products
      try {
        const prodRes = await api.get("/products");
        if (prodRes.data?.success && Array.isArray(prodRes.data.data)) {
          setProducts(
            prodRes.data.data.map((item) => {
              const rawImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
              return {
                id: item._id,
                _id: item._id,
                name: item.name,
                astrologer: item.createdBy?.fullName || "Acharya Expert",
                createdBy: item.createdBy?._id || item.createdBy,
                category: item.category,
                type: item.type || "Standard",
                price: item.sellingPrice || item.originalPrice,
                sellingPrice: item.sellingPrice,
                originalPrice: item.originalPrice,
                stock: item.stock,
                status: item.isActive ? "active" : "draft",
                isActive: item.isActive,
                images: item.images || [],
                image: rawImg,
                badge: item.badge,
                shortDescription: item.shortDescription,
                description: item.description,
              };
            })
          );
        }
      } catch (err) {
        console.warn("Could not fetch products from backend, using current state.");
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch Orders (role-aware: astrologer sees only their product orders)
  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const savedUser = localStorage.getItem("jyotish_user");
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      const currentRole = currentUser?.role;
      const isAstrologer = currentRole === "astrologer";
      const astroId = currentUser?._id || currentUser?.id;

      // Fetch all orders from backend
      const res = await api.get("/orders");
      if (res.data?.success && Array.isArray(res.data.data)) {
        let allOrders = res.data.data;

        if (isAstrologer && astroId) {
          // Fetch this astrologer's products FRESH from API (avoids stale state race condition)
          let myProductIds = new Set();
          let myProductNames = new Set();
          try {
            const prodRes = await api.get("/products");
            if (prodRes.data?.success && Array.isArray(prodRes.data.data)) {
              prodRes.data.data.forEach((p) => {
                const createdById = p.createdBy?._id || p.createdBy;
                if (String(createdById) === String(astroId)) {
                  if (p._id) myProductIds.add(String(p._id));
                  if (p.name) myProductNames.add(p.name.trim().toLowerCase());
                }
              });
            }
          } catch (prodErr) {
            console.warn("Could not fetch astrologer products:", prodErr);
          }

          // Filter: match by product MongoDB ID (primary) OR product name (fallback for null IDs)
          allOrders = allOrders.filter((order) =>
            order.items?.some((item) => {
              const byId = item.product && myProductIds.has(String(item.product));
              const byName = item.name && myProductNames.has(item.name.trim().toLowerCase());
              return byId || byName;
            })
          );
        }

        setOrders(allOrders);
      }
    } catch (err) {
      console.warn("Could not fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  // Initial load effect
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);

  // Live Login API handler using Axios
  async function login(identifier, password) {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/auth/login", { identifier, password });

      if (res.data && res.data.success) {
        const userToken = res.data.token;
        const userData = res.data.data;

        localStorage.setItem("jyotish_token", userToken);
        localStorage.setItem("jyotish_user", JSON.stringify(userData));

        setToken(userToken);
        setUser(userData);

        return { success: true, data: userData };
      } else {
        const msg = res.data?.message || "Login failed";
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to log in";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }

  // Logout handler
  function logout() {
    localStorage.removeItem("jyotish_token");
    localStorage.removeItem("jyotish_user");
    setToken(null);
    setUser(null);
    setPending(PENDING_ASTROLOGERS);
    setAstrologers(ALL_ASTROLOGERS);
    setAppointments(APPOINTMENTS);
    setProducts(PRODUCTS);
    setOrders([]);
  }

  // Decide Astrologer status (Approve / Reject / Block) via Axios
  async function decideAstrologer(id, status) {
    try {
      const res = await api.patch(`/admin/astrologers/${id}/status`, { status });
      if (res.data?.success) {
        fetchDashboardData();
      } else {
        // Fallback UI update
        const found = pending.find((p) => p.id === id);
        setPending((prev) => prev.filter((p) => p.id !== id));
        if (found && status === "active") {
          setAstrologers((prev) => [{ ...found, status: "active" }, ...prev]);
        }
      }
    } catch (err) {
      console.error("Update Astrologer Status Error:", err);
      // Fallback local state update
      const found = pending.find((p) => p.id === id);
      setPending((prev) => prev.filter((p) => p.id !== id));
      if (found && status === "active") {
        setAstrologers((prev) => [{ ...found, status: "active" }, ...prev]);
      }
    }
  }

  // Change appointment status via Axios
  async function changeAppointmentStatus(id, status) {
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      if (res.data?.success) {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      } else {
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      }
    } catch (err) {
      console.error("Change Appointment Status Error:", err);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  }

  // Add Product via Axios (supports FormData or JSON Object)
  async function addProduct(productData) {
    try {
      let payload = productData;
      const userId = user?._id || user?.id;

      const isFormData = productData instanceof FormData;
      if (isFormData) {
        if (!productData.has("createdBy") && userId) {
          productData.append("createdBy", userId);
        }
      } else if (typeof productData === "object" && !productData.createdBy && userId) {
        payload = { ...productData, createdBy: userId };
      }

      const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const res = await api.post("/products", payload, config);
      if (res.data?.success) {
        await fetchDashboardData();
        return { success: true, message: res.data.message };
      } else {
        fetchDashboardData();
        return { success: false, message: res.data?.message || "Failed to add product" };
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      fetchDashboardData();
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }

  // Update product via Axios (PUT /api/products/:id)
  async function updateProduct(id, productData) {
    try {
      const isFormData = productData instanceof FormData;
      const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const res = await api.put(`/products/${id}`, productData, config);
      if (res.data?.success) {
        await fetchDashboardData();
        return { success: true, message: res.data.message };
      } else {
        fetchDashboardData();
        return { success: false, message: res.data?.message || "Failed to update product" };
      }
    } catch (err) {
      console.error("Update Product Error:", err);
      fetchDashboardData();
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }

  // Delete product via Axios
  async function deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => (p.id !== id && p._id !== id)));
    } catch (err) {
      console.error("Delete Product Error:", err);
      setProducts((prev) => prev.filter((p) => (p.id !== id && p._id !== id)));
    }
  }

  // Update Order Status (Admin / Astrologer)
  async function updateOrderStatus(mongoId, orderStatus, paymentStatus) {
    try {
      const payload = {};
      if (orderStatus) payload.orderStatus = orderStatus;
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const res = await api.patch(`/orders/${mongoId}/status`, payload);
      if (res.data?.success) {
        // Update orders state locally with new status
        setOrders((prev) =>
          prev.map((o) =>
            o._id === mongoId
              ? {
                  ...o,
                  ...(orderStatus ? { orderStatus } : {}),
                  ...(paymentStatus ? { paymentStatus } : {}),
                }
              : o
          )
        );
        return { success: true };
      }
      return { success: false, message: res.data?.message };
    } catch (err) {
      console.error("Update Order Status Error:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  }

  const value = {
    token,
    user,
    role,
    loading,
    error,
    login,
    logout,
    pending,
    astrologers,
    setAstrologers,
    appointments,
    products,
    orders,
    loadingOrders,
    fetchOrders,
    updateOrderStatus,
    decideAstrologer,
    changeAppointmentStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchDashboardData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
