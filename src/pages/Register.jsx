import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const { register, sendOtp } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ==============================
    // VALIDATION
    // ==============================

    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      // ==============================
      // STEP 1: REGISTER
      // ==============================

      const response = await register(formData);

      console.log(
        "Registration response:",
        response
      );

      const userId = response?.user?.id;

      if (!userId) {
        throw new Error(
          "Registration successful but user ID was not received."
        );
      }

      // ==============================
      // STEP 2: SEND OTP
      // ==============================

      await sendOtp(userId);

      // ==============================
      // STEP 3: GO TO VERIFY OTP
      // ==============================

      navigate("/verify-otp", {
        state: {
          userId: userId,
          phone: formData.phone,
        },
      });

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.message ||
          "Failed to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* =========================
            LOGO
        ========================== */}

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
            Start managing your money better.
          </p>

        </div>

        {/* =========================
            REGISTER CARD
        ========================== */}

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Create account
            </h2>

            <p className="text-slate-500 mt-1">
              Create your MoneySplit account
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =========================
                NAME
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

            </div>

            {/* =========================
                EMAIL
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

            </div>

            {/* =========================
                PHONE
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile number
              </label>

              <div className="relative">

                <Phone
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  +91
                </span>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  required
                  inputMode="numeric"
                  autoComplete="tel"
                  className="w-full pl-[4.5rem] pr-4 py-3 border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

              </div>

              <p className="text-xs text-slate-400 mt-1.5">
                We will send an OTP to verify your mobile number.
              </p>

            </div>

            {/* =========================
                PASSWORD
            ========================== */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

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
                  placeholder="Minimum 6 characters"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
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

            {/* =========================
                CREATE ACCOUNT
            ========================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* =========================
              LOGIN
          ========================== */}

          <p className="text-center text-sm text-slate-500 mt-6">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Login
            </Link>

          </p>

        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 MoneySplit
        </p>

      </div>

    </div>
  );
}