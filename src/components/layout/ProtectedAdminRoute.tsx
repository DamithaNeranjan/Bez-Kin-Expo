import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function ProtectedAdminRoute({ children }: { children: JSX.Element }) {
  const { loading, user, isAdmin, authReady } = useAuth();

  if (!authReady) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-semibold text-slate-600">
        <LoadingSpinner label="Checking administrator access..." size="lg" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
