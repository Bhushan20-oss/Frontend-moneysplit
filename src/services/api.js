const API_URL =import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  /* =======================================================
     UNAUTHORIZED / EXPIRED TOKEN
  ======================================================= */

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error(
      data.message || "Session expired. Please login again."
    );
  }

  /* =======================================================
     OTHER API ERRORS
  ======================================================= */

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}


/* =========================================================
   API
========================================================= */

export const api = {

  // =======================================================
  // AUTH
  // =======================================================

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    apiRequest("/auth/me"),

  updateProfile: (profileData) =>
    apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData) =>
    apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    }),


  // =======================================================
  // PHONE OTP
  // =======================================================

  sendOtp: (userId) =>
    apiRequest("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
    }),

  resendOtp: (userId) =>
    apiRequest("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
    }),

  verifyPhone: (userId, otp) =>
    apiRequest("/auth/verify-phone", {
      method: "POST",
      body: JSON.stringify({
        userId,
        otp,
      }),
    }),


  // =======================================================
  // FORGOT PASSWORD
  // =======================================================

  forgotPassword: (email) =>
    apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }),

  verifyResetOtp: (email, otp) =>
    apiRequest("/auth/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
      }),
    }),

  resetPassword: (resetToken, newPassword) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        resetToken,
        newPassword,
      }),
    }),


  // =======================================================
  // EXPENSES
  // =======================================================

  getExpenses: () =>
    apiRequest("/expenses"),

  getExpense: (id) =>
    apiRequest(`/expenses/${id}`),

  addExpense: (expense) =>
    apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    }),

  updateExpense: (id, expense) =>
    apiRequest(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    }),

  deleteExpense: (id) =>
    apiRequest(`/expenses/${id}`, {
      method: "DELETE",
    }),


  // =======================================================
  // INCOME
  // =======================================================

  getIncome: () =>
    apiRequest("/income"),

  getIncomeById: (id) =>
    apiRequest(`/income/${id}`),

  addIncome: (income) =>
    apiRequest("/income", {
      method: "POST",
      body: JSON.stringify(income),
    }),

  updateIncome: (id, income) =>
    apiRequest(`/income/${id}`, {
      method: "PUT",
      body: JSON.stringify(income),
    }),

  deleteIncome: (id) =>
    apiRequest(`/income/${id}`, {
      method: "DELETE",
    }),


  // =======================================================
  // SAVINGS
  // =======================================================

  getSavings: () =>
    apiRequest("/savings"),

  getSaving: (id) =>
    apiRequest(`/savings/${id}`),

  addSaving: (saving) =>
    apiRequest("/savings", {
      method: "POST",
      body: JSON.stringify(saving),
    }),

  updateSaving: (id, saving) =>
    apiRequest(`/savings/${id}`, {
      method: "PUT",
      body: JSON.stringify(saving),
    }),

  deleteSaving: (id) =>
    apiRequest(`/savings/${id}`, {
      method: "DELETE",
    }),


  // =======================================================
  // BILLS
  // =======================================================

  getBills: () =>
    apiRequest("/bills"),

  getBill: (id) =>
    apiRequest(`/bills/${id}`),

  addBill: (bill) =>
    apiRequest("/bills", {
      method: "POST",
      body: JSON.stringify(bill),
    }),

  updateBill: (id, bill) =>
    apiRequest(`/bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(bill),
    }),

  deleteBill: (id) =>
    apiRequest(`/bills/${id}`, {
      method: "DELETE",
    }),


  // =======================================================
  // BUDGETS
  // =======================================================

  getBudgets: () =>
    apiRequest("/budgets"),

  getBudget: (id) =>
    apiRequest(`/budgets/${id}`),

  addBudget: (budget) =>
    apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify(budget),
    }),

  updateBudget: (id, budget) =>
    apiRequest(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budget),
    }),

  deleteBudget: (id) =>
    apiRequest(`/budgets/${id}`, {
      method: "DELETE",
    }),


  // =======================================================
  // DASHBOARD
  // =======================================================

  getDashboard: (month, year) =>
    apiRequest(
      `/dashboard?month=${month}&year=${year}`
    ),


  // =======================================================
  // REPORTS
  // =======================================================

  getMonthlyReport: (month, year) =>
    apiRequest(
      `/reports/monthly?month=${month}&year=${year}`
    ),

  getComparisonReport: (month, year) =>
    apiRequest(
      `/reports/comparison?month=${month}&year=${year}`
    ),
};