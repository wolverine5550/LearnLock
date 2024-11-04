import { PublicRoute } from "@/src/components/auth/PublicRoute";
import { AuthPage as AuthPageContent } from "@/src/components/AuthPage";

export default function AuthPage() {
  return (
    <PublicRoute>
      <AuthPageContent />
    </PublicRoute>
  );
} 