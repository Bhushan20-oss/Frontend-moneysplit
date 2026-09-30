import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message || "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const identifier = formData.identifier.trim();

    if (!identifier) {
      setError("Please enter your email or mobile number.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login({
        identifier,
        password: formData.password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Invalid email/mobile number or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const isPhone = /^[+0-9\s-]+$/.test(
    formData.identifier.trim()
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 mb-4 shadow-lg shadow-emerald-500/20">
            <Wallet
              size={28}
              className="text-white"
            />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Money
            <span className="text-emerald-400">
              Split
            </span>
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your money smarter.
          </p>

        </div>

        {/* LOGIN CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Welcome back
            </h2>

            <p className="text-slate-500 mt-1">
              Login to your MoneySplit account
            </p>

          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL / PHONE */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email or mobile number
              </label>

              <div className="relative">

                {isPhone ? (
                  <Phone
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                ) : (
                  <Mail
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                )}

                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Email or mobile number"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* REGISTER */}
          <p className="text-center text-sm text-slate-500 mt-6">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Create account
            </Link>

          </p>

        </div>

        {/* FOOTER */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 MoneySplit
        </p>

      </div>

    </div>
  );
}