'use client';

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { HomePage } from "@/src/components/HomePage";
import { LoadingPage } from "@/src/components/LoadingPage";
import { useAuth } from "@/src/contexts/AuthContext";

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
