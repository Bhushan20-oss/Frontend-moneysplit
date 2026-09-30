import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     CHECK EXISTING LOGIN
  ===================================================== */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((data) => {
        setUser(data.user);

        // Keep localStorage synchronized
        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = async (credentials) => {
    const data = await api.login(credentials);

    if (!data.token) {
      throw new Error(
        "Login successful but token was not received."
      );
    }

    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);
    }

    return data;
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const register = async (userData) => {
    const data = await api.register(userData);

    /*
     * Registration does NOT log the user in.
     *
     * Backend returns:
     * {
     *   message,
     *   user: {
     *      id,
     *      name,
     *      email,
     *      phone,
     *      phoneVerified
     *   }
     * }
     */

    return data;
  };

  /* =====================================================
     SEND OTP
  ===================================================== */

  const sendOtp = async (userId) => {
    const data = await api.sendOtp(userId);

    return data;
  };

  /* =====================================================
     RESEND OTP
  ===================================================== */

  const resendOtp = async (userId) => {
    const data = await api.resendOtp(userId);

    return data;
  };

  /* =====================================================
     VERIFY PHONE
  ===================================================== */

  const verifyPhone = async (userId, otp) => {
    const data = await api.verifyPhone(
      userId,
      otp
    );

    return data;
  };

  /* =====================================================
     UPDATE USER
     Used after updating profile information
  ===================================================== */

  const updateUser = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  /* =====================================================
     CONTEXT
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        login,
        register,

        sendOtp,
        resendOtp,
        verifyPhone,

        updateUser,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =======================================================
   HOOK
======================================================= */

export function useAuth() {
  return useContext(AuthContext);
}