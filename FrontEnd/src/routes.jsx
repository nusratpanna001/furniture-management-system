import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin pages
import AdminProductsPage from "./pages/AdminProductsPage";
import DashboardPage from "./pages/DashboardPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
// import SuppliersPage from "./pages/SuppliersPage";
import PurchasesPage from "./pages/PurchasesPage";
import ReportsPage from "./pages/ReportsPage";

// User pages
import UserDashboardPage from "./pages/UserDashboardPage";

// Public pages
import LandingPage from "./pages/LandingPage";
// import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ContactUsPage from "./pages/ContactUsPage";
import MyCartPage from "./pages/MyCartPage";
import CheckoutPage from "./pages/CheckoutPage";

// Auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Components
import PublicRoute from "./contexts/PublicRoute";
import ProtectedRoute from "./contexts/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/home" element={<HomePage />} /> */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/my-cart" element={<MyCartPage />} />

      {/* Auth pages */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Admin pages */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout><DashboardPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin-products" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout><AdminProductsPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin-categories" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout><AdminCategoriesPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute requiredRole={['admin','staff']}>
          <AppLayout><OrdersPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/orders/:id" element={
        <ProtectedRoute requiredRole={['admin','staff']}>
          <AppLayout><OrderDetailsPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/suppliers" element={
        <ProtectedRoute requiredRole="admin">
          {/* <AppLayout><SuppliersPage /></AppLayout> */}
        </ProtectedRoute>
      } />
      <Route path="/purchases" element={
        <ProtectedRoute requiredRole={['admin','staff']}>
          <AppLayout><PurchasesPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute requiredRole="admin">
          <AppLayout><ReportsPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* User pages */}
      <Route path="/user-dashboard" element={
        <ProtectedRoute requiredRole="user">
          <AppLayout><UserDashboardPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
