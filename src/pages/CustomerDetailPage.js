import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
export function CustomerDetailPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState(() => `Assessment – ${new Date().toLocaleDateString("en-GB")}`);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        api
            .getCustomer(id)
            .then((data) => {
            setCustomer(data.customer);
            setAssessments(data.assessments);
        })
            .catch((err) => setError(String(err)));
    }, [id]);
    if (error)
        return _jsx("p", { className: "text-red-700", children: error });
    if (!customer)
        return _jsx("p", { className: "text-slate-500 text-sm", children: "Loading\u2026" });
    return (_jsxs("div", { children: [_jsx(Link, { to: "/", className: "text-sm text-slate-500 hover:underline", children: "\u2190 All customers" }), _jsx("h1", { className: "text-2xl font-semibold mt-2", children: customer.name }), _jsxs("p", { className: "text-sm text-slate-500", children: [customer.phase, customer.urn && ` · URN ${customer.urn}`, customer.trust_name && ` · ${customer.trust_name}`] }), _jsxs("div", { className: "mt-6 bg-white rounded shadow-sm p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h2", { className: "font-semibold", children: "Assessments" }), _jsxs("form", { onSubmit: async (e) => {
                                    e.preventDefault();
                                    if (!id)
                                        return;
                                    setCreating(true);
                                    try {
                                        const { id: newId } = await api.createAssessment({
                                            customerId: id,
                                            title,
                                        });
                                        nav(`/assessments/${newId}`);
                                    }
                                    catch (err) {
                                        setError(String(err));
                                    }
                                    finally {
                                        setCreating(false);
                                    }
                                }, className: "flex items-center gap-2", children: [_jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "border rounded px-2 py-1 text-sm", placeholder: "Assessment title" }), _jsx("button", { type: "submit", disabled: creating, className: "bg-slate-900 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50", children: creating ? "Creating…" : "+ Start assessment" })] })] }), assessments.length === 0 ? (_jsx("p", { className: "text-slate-500 text-sm", children: "No assessments yet. Start one to walk this school through the standards." })) : (_jsx("ul", { className: "divide-y", children: assessments.map((a) => (_jsxs("li", { className: "py-2 flex items-center justify-between", children: [_jsxs(Link, { to: `/assessments/${a.id}`, className: "hover:underline", children: [_jsx("span", { className: "font-medium", children: a.title }), _jsx("span", { className: "ml-2 text-xs text-slate-500", children: a.status })] }), _jsxs("span", { className: "text-xs text-slate-400", children: [new Date(a.started_at).toLocaleDateString("en-GB"), a.completed_at &&
                                            ` → ${new Date(a.completed_at).toLocaleDateString("en-GB")}`] })] }, a.id))) }))] })] }));
}
