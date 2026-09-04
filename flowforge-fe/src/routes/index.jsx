import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../src/features/HomePage/components/HomePage";
import CollectionPage from "../features/HomePage/components/Collection/CollectionPage";
import SmoothLayout from "../shared/components/Effect/SmoothLayout";
import Profile from "../features/Profile/pages/UserProfile";
import { ProtectedRoute, PublicOnlyRoute } from './RouteGuard';

// Lazy loading auth module
const Login = lazy(() => import('../features/auth').then(module => ({ default: module.Login })));
const Register = lazy(() => import('../features/auth').then(module => ({ default: module.Register })));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#faf9f6' }}>
    <span className="loader" style={{ borderColor: 'rgba(0,0,0,0.1)', borderBottomColor: '#1a1a1a' }}></span>
  </div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <SmoothLayout>
                <HomePage />
              </SmoothLayout>
            }
          />
          <Route path="/Workspace" element={
            <ProtectedRoute><CollectionPage /></ProtectedRoute>
          } />
          <Route path="/login" element={
            <PublicOnlyRoute><Login /></PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute><Register /></PublicOnlyRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}