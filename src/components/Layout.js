import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
export function Layout() {
    const [user, setUser] = useState(null);
    const [identityError, setIdentityError] = useState(null);
    useEffect(() => {
        api
            .me()
            .then(setUser)
            .catch((err) => setIdentityError(String(err)));
    }, []);
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx("header", { className: "no-print bg-slate-900 text-white", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-3 flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "font-semibold text-lg", children: "DfE Digital Standards \u00B7 Maturity Model" }), _jsx("div", { className: "text-sm", children: user ? (_jsxs("span", { children: ["Signed in as ", _jsx("span", { className: "font-mono", children: user.email })] })) : identityError ? (_jsx("span", { className: "text-red-300", children: "Identity unavailable" })) : (_jsx("span", { className: "text-slate-300", children: "Loading\u2026" })) })] }) }), _jsx("main", { className: "flex-1", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 py-6", children: _jsx(Outlet, {}) }) }), _jsxs("footer", { className: "no-print text-xs text-slate-500 px-4 py-3 text-center", children: ["Source:", " ", _jsx("a", { className: "underline", href: "https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges", target: "_blank", rel: "noreferrer", children: "gov.uk/guidance/meeting-digital-and-technology-standards" })] })] }));
}
