import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
const PHASES = [
    { value: "Primary", label: "Primary" },
    { value: "Secondary", label: "Secondary" },
    { value: "AllThrough", label: "All-through" },
    { value: "FE", label: "Further Education" },
    { value: "SpecialSEND", label: "Special / SEND" },
];
export function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNew, setShowNew] = useState(false);
    const refresh = () => {
        setLoading(true);
        api
            .listCustomers()
            .then(setCustomers)
            .catch((err) => setError(String(err)))
            .finally(() => setLoading(false));
    };
    useEffect(refresh, []);
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Customers" }), _jsx("button", { onClick: () => setShowNew((v) => !v), className: "bg-slate-900 text-white px-3 py-1.5 rounded text-sm", children: showNew ? "Cancel" : "+ New customer" })] }), showNew && (_jsx(NewCustomerForm, { onCreated: () => {
                    setShowNew(false);
                    refresh();
                } })), error && _jsx("p", { className: "text-red-700 text-sm", children: error }), loading && !error && _jsx("p", { className: "text-slate-500 text-sm", children: "Loading\u2026" }), !loading && customers.length === 0 && !error && (_jsx("p", { className: "text-slate-500 text-sm", children: "No customers yet. Add one to start an assessment." })), _jsx("ul", { className: "divide-y bg-white rounded shadow-sm", children: customers.map((c) => (_jsxs("li", { className: "px-4 py-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(Link, { to: `/customers/${c.id}`, className: "font-medium text-slate-900 hover:underline", children: c.name }), _jsxs("div", { className: "text-xs text-slate-500", children: [c.phase, c.urn && ` · URN ${c.urn}`, c.trust_name && ` · ${c.trust_name}`] })] }), _jsx("span", { className: "text-xs text-slate-400", children: new Date(c.created_at).toLocaleDateString("en-GB") })] }, c.id))) })] }));
}
function NewCustomerForm({ onCreated }) {
    const [name, setName] = useState("");
    const [urn, setUrn] = useState("");
    const [phase, setPhase] = useState("Primary");
    const [trustName, setTrustName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    return (_jsxs("form", { onSubmit: async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            try {
                await api.createCustomer({
                    name,
                    urn: urn || undefined,
                    phase,
                    trustName: trustName || undefined,
                });
                setName("");
                setUrn("");
                setTrustName("");
                onCreated();
            }
            catch (err) {
                setError(String(err));
            }
            finally {
                setSubmitting(false);
            }
        }, className: "bg-white border rounded p-4 mb-4 space-y-2", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("label", { className: "text-sm", children: ["School name", _jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), className: "mt-1 w-full border rounded px-2 py-1" })] }), _jsxs("label", { className: "text-sm", children: ["Phase", _jsx("select", { value: phase, onChange: (e) => setPhase(e.target.value), className: "mt-1 w-full border rounded px-2 py-1 bg-white", children: PHASES.map((p) => (_jsx("option", { value: p.value, children: p.label }, p.value))) })] }), _jsxs("label", { className: "text-sm", children: ["URN ", _jsx("span", { className: "text-slate-400", children: "(optional)" }), _jsx("input", { value: urn, onChange: (e) => setUrn(e.target.value), className: "mt-1 w-full border rounded px-2 py-1" })] }), _jsxs("label", { className: "text-sm", children: ["Trust / MAT ", _jsx("span", { className: "text-slate-400", children: "(optional)" }), _jsx("input", { value: trustName, onChange: (e) => setTrustName(e.target.value), className: "mt-1 w-full border rounded px-2 py-1" })] })] }), error && _jsx("p", { className: "text-red-700 text-xs", children: error }), _jsx("button", { type: "submit", disabled: submitting, className: "bg-slate-900 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50", children: submitting ? "Creating…" : "Create customer" })] }));
}
