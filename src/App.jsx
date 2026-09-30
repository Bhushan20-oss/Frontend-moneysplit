import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Savings from "./pages/Savings";
import Bills from "./pages/Bills";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Expenses from "./pages/Expenses";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>
          }
        />
        <Route
  path="/savings"
  element={
    <ProtectedRoute>
      <Savings />
    </ProtectedRoute>
  }
/>

<Route
  path="/bills"
  element={
    <ProtectedRoute>
      <Bills />
    </ProtectedRoute>
  }
/>

<Route
  path="/budgets"
  element={
    <ProtectedRoute>
      <Budgets />
    </ProtectedRoute>
  }
/>
<Route
  path="/reports"
  element={
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  }
/>
<Route
  path="/expenses"
  element={
    <ProtectedRoute>
      <Expenses />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}