import { useEffect, useRef, useState } from "react";
import {
  Wallet,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    verifyPhone,
    resendOtp,
  } = useAuth();

  const userId = location.state?.userId;
  const phone = location.state?.phone;

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const inputRefs = useRef([]);

  /* =====================================================
     CHECK USER ID
  ===================================================== */

  useEffect(() => {
    if (!userId) {
      navigate("/register");
    }
  }, [userId, navigate]);

  /* =====================================================
     COUNTDOWN
  ===================================================== */

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  /* =====================================================
     OTP INPUT
  ===================================================== */

  const handleOtpChange = (index, value) => {
    const cleanValue = value
      .replace(/\D/g, "")
      .slice(-1);

    const newOtp = [...otp];

    newOtp[index] = cleanValue;

    setOtp(newOtp);
    setError("");

    if (
      cleanValue &&
      index < otp.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* =====================================================
     BACKSPACE
  ===================================================== */

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* =====================================================
     PASTE OTP
  ===================================================== */

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];

    pastedData
      .split("")
      .forEach((digit, index) => {
        newOtp[index] = digit;
      });

    setOtp(newOtp);

    const focusIndex = Math.min(
      pastedData.length,
      5
    );

    inputRefs.current[focusIndex]?.focus();
  };

  /* =====================================================
     VERIFY OTP
  ===================================================== */

  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await verifyPhone(
        userId,
        otpValue
      );

      setSuccess(
        "Mobile number verified successfully!"
      );

      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Mobile number verified successfully. Please login.",
          },
        });
      }, 1200);

    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setError(
        error.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RESEND OTP
  ===================================================== */

  const handleResend = async () => {
    if (countdown > 0 || resending) {
      return;
    }

    setError("");
    setSuccess("");
    setResending(true);

    try {
      await resendOtp(userId);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setCountdown(30);

      setSuccess(
        "A new OTP has been sent."
      );

      inputRefs.current[0]?.focus();

    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      setError(
        error.message ||
          "Failed to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  /* =====================================================
     FORMAT PHONE
  ===================================================== */

  const maskedPhone = phone
    ? `+91 ${phone.slice(0, 2)}******${phone.slice(-2)}`
    : "your mobile number";

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

        </div>

        {/* CARD */}

        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">

          {/* ICON */}

          <div className="flex justify-center mb-5">

            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">

              <ShieldCheck
                size={32}
                className="text-emerald-500"
              />

            </div>

          </div>

          {/* TITLE */}

          <div className="text-center mb-7">

            <h2 className="text-2xl font-bold text-slate-900">
              Verify your number
            </h2>

            <p className="text-slate-500 mt-2 text-sm leading-6">
              Enter the 6-digit OTP sent to
              <br />

              <span className="font-semibold text-slate-700">
                {maskedPhone}
              </span>
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 text-center">
              {success}
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleVerify}>

            {/* OTP BOXES */}

            <div className="flex justify-center gap-2 sm:gap-3 mb-7">

              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      index,
                      e
                    )
                  }
                  onPaste={handlePaste}
                  autoFocus={index === 0}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold border border-slate-200 rounded-xl outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              ))}

            </div>

            {/* VERIFY */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading
                ? "Verifying..."
                : "Verify mobile number"}
            </button>

          </form>

          {/* RESEND */}

          <div className="text-center mt-6">

            {countdown > 0 ? (
              <p className="text-sm text-slate-500">
                Resend OTP in{" "}
                <span className="font-semibold text-slate-700">
                  {countdown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    resending
                      ? "animate-spin"
                      : ""
                  }
                />

                {resending
                  ? "Sending..."
                  : "Resend OTP"}
              </button>
            )}

          </div>

          {/* BACK */}

          <div className="text-center mt-6 pt-5 border-t border-slate-100">

            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={16} />
              Back to registration
            </Link>

          </div>

        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 MoneySplit
        </p>

      </div>

    </div>
  );
}