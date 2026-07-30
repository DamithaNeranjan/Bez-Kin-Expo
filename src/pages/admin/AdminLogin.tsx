import { LogIn } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Seo } from "../../components/Seo";
import { useAuth } from "../../contexts/AuthContext";

export function AdminLogin() {
  const { signInWithGoogle, user, isAdmin, authReady, loading } = useAuth();

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Seo title="Admin login | Bez-Kin Expo" description="Administrator login for Bez-Kin Expo catalogue management." path="/admin/login" />
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <Link to="/" className="text-sm font-bold text-leaf">
            Back to website
          </Link>
          <h1 className="mt-6 text-3xl font-black text-ink">Admin login</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use an approved Google Workspace account. A matching active user document with the administrator role is required in Firestore.
          </p>
          {!authReady ? (
            <div className="mt-6 rounded-md border border-harvest/30 bg-harvest/10 p-4 text-sm leading-6 text-ink">
              Firebase environment values are not configured yet. Add them to a local `.env` file from `.env.example` to enable Google sign-in.
            </div>
          ) : null}
          {user && !isAdmin ? (
            <div className="mt-6 rounded-md border border-berry/30 bg-berry/10 p-4 text-sm leading-6 text-ink">
              This Google account is signed in but is not an active administrator.
            </div>
          ) : null}
          <button
            type="button"
            disabled={!authReady}
            onClick={() => void signInWithGoogle()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            Continue with Google
          </button>
        </section>
      </main>
    </>
  );
}
