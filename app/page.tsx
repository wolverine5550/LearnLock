'use client';

import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute";
import { HomePage } from "@/src/components/HomePage";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
