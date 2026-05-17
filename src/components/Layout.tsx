import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

export function Layout() {
  const [user, setUser] = useState<{ email: string; oid: string } | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);

  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch((err) => setIdentityError(String(err)));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">
            DfE Digital Standards · Maturity Model
          </Link>
          <div className="text-sm">
            {user ? (
              <span>
                Signed in as <span className="font-mono">{user.email}</span>
              </span>
            ) : identityError ? (
              <span className="text-red-300">Identity unavailable</span>
            ) : (
              <span className="text-slate-300">Loading…</span>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <footer className="no-print text-xs text-slate-500 px-4 py-3 text-center">
        Source:{" "}
        <a
          className="underline"
          href="https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges"
          target="_blank"
          rel="noreferrer"
        >
          gov.uk/guidance/meeting-digital-and-technology-standards
        </a>
      </footer>
    </div>
  );
}
