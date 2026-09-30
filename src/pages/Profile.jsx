import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const [profileSuccess, setProfileSuccess] =
    useState("");

  const [passwordData, setPasswordData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setProfileError("");

      const response = await api.getMe();

      const currentUser =
        response?.user ||
        response?.data ||
        response;

      setProfile({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
      });
    } catch (error) {
      console.error(
        "Load profile error:",
        error
      );

      setProfileError(
        error.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileError("");
    setProfileSuccess("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileError("");
    setProfileSuccess("");

    if (!profile.name.trim()) {
      setProfileError(
        "Please enter your name."
      );
      return;
    }

    if (!profile.email.trim()) {
      setProfileError(
        "Please enter your email."
      );
      return;
    }

    if (!profile.phone.trim()) {
      setProfileError(
        "Please enter your phone number."
      );
      return;
    }

    try {
      setSavingProfile(true);

      const response =
        await api.updateProfile({
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim(),
        });

      const updatedUser =
        response?.user ||
        response?.data ||
        null;

      if (updatedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      } else {
        const existingUser =
          JSON.parse(
            localStorage.getItem("user") ||
              "{}"
          );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...existingUser,
            ...profile,
          })
        );
      }

      setProfileSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setProfileError(
        error.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordData.currentPassword) {
      setPasswordError(
        "Please enter your current password."
      );
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError(
        "Please enter a new password."
      );
      return;
    }

    if (
      passwordData.newPassword.length < 8
    ) {
      setPasswordError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      await api.changePassword({
        currentPassword:
          passwordData.currentPassword,
        newPassword:
          passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setPasswordError(
        error.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const passwordStrength = () => {
    const password =
      passwordData.newPassword;

    if (!password) {
      return {
        label: "",
        width: "0%",
      };
    }

    if (password.length < 8) {
      return {
        label: "Too short",
        width: "25%",
      };
    }

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/[0-9]/.test(password)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    }

    if (score <= 1) {
      return {
        label: "Weak",
        width: "35%",
      };
    }

    if (score === 2) {
      return {
        label: "Fair",
        width: "55%",
      };
    }

    if (score === 3) {
      return {
        label: "Good",
        width: "75%",
      };
    }

    return {
      label: "Strong",
      width: "100%",
    };
  };

  const strength =
    passwordStrength();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        user={user}
        onLogout={logout}
      />

      <main className="lg:ml-64">
        <DashboardHeader
          onLogout={logout}
        />

        <div className="p-4 sm:p-6 lg:p-8">

          {/* PAGE HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <User size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Profile
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your personal information and account security.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />

              <p className="mt-4 text-sm text-slate-500">
                Loading your profile...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

              {/* PERSONAL INFORMATION */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                      <User size={19} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Personal Information
                      </h2>

                      <p className="text-sm text-slate-500">
                        Update your account details.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    handleProfileSubmit
                  }
                  className="space-y-5 p-6"
                >

                  {profileError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {profileError}
                    </div>
                  )}

                  {profileSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      <CheckCircle2
                        size={17}
                      />

                      {profileSuccess}
                    </div>
                  )}

                  {/* NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={
                          handleProfileChange
                        }
                        placeholder="Your full name"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={
                          handleProfileChange
                        }
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone
                    </label>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={
                          handleProfileChange
                        }
                        placeholder="Phone number"
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>

                  {/* SAVE */}
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={18} />

                    {savingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* SECURITY */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                      <ShieldCheck
                        size={19}
                      />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Account Security
                      </h2>

                      <p className="text-sm text-slate-500">
                        Keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={
                    handlePasswordSubmit
                  }
                  className="space-y-5 p-6"
                >

                  {passwordError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      <CheckCircle2
                        size={17}
                      />

                      {passwordSuccess}
                    </div>
                  )}

                  {/* CURRENT PASSWORD */}
                  <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    show={
                      showCurrentPassword
                    }
                    setShow={
                      setShowCurrentPassword
                    }
                    placeholder="Enter current password"
                  />

                  {/* NEW PASSWORD */}
                  <PasswordInput
                    label="New Password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    show={
                      showNewPassword
                    }
                    setShow={
                      setShowNewPassword
                    }
                    placeholder="Enter new password"
                  />

                  {/* STRENGTH */}
                  {passwordData.newPassword && (
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Password strength
                        </span>

                        <span className="font-medium text-slate-600">
                          {strength.label}
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{
                            width:
                              strength.width,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CONFIRM PASSWORD */}
                  <PasswordInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    show={
                      showConfirmPassword
                    }
                    setShow={
                      setShowConfirmPassword
                    }
                    placeholder="Confirm new password"
                  />

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Lock size={18} />

                    {changingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </button>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs leading-5 text-slate-500">
                      Use a password with at least 8 characters. A combination of uppercase letters, numbers and special characters is recommended.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================= */
/* PASSWORD INPUT */
/* ============================= */

function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />

        <button
          type="button"
          onClick={() =>
            setShow((previous) => !previous)
          }
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
        >
          {show ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}