import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, } from "../api";
export function AssessmentPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [responses, setAssessmentResponses] = useState([]);
    const [standards, setStandards] = useState([]);
    const [activeStandard, setActiveStandard] = useState(null);
    const [error, setError] = useState(null);
    const [generatingReport, setGeneratingReport] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        Promise.all([api.getAssessment(id), api.getStandards()])
            .then(([a, s]) => {
            setAssessment(a.assessment);
            setAssessmentResponses(a.responses);
            setStandards(s.standards);
            if (s.standards.length > 0)
                setActiveStandard(s.standards[0].id);
        })
            .catch((err) => setError(String(err)));
    }, [id]);
    const responseBySub = useMemo(() => {
        const m = new Map();
        for (const r of responses)
            m.set(r.sub_criterion_id, r);
        return m;
    }, [responses]);
    const totalsByStandard = useMemo(() => {
        const out = new Map();
        for (const std of standards) {
            let answered = 0;
            let sum = 0;
            let weight = 0;
            for (const sc of std.subCriteria) {
                const r = responseBySub.get(sc.id);
                if (r && r.level != null && !r.not_applicable) {
                    answered++;
                    sum += r.level * sc.weight;
                    weight += sc.weight;
                }
            }
            out.set(std.id, {
                answered,
                total: std.subCriteria.length,
                average: weight > 0 ? sum / weight : null,
            });
        }
        return out;
    }, [standards, responseBySub]);
    if (error)
        return _jsx("p", { className: "text-red-700", children: error });
    if (!assessment || !standards.length)
        return _jsx("p", { className: "text-slate-500 text-sm", children: "Loading\u2026" });
    const active = standards.find((s) => s.id === activeStandard) ?? standards[0];
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx(Link, { to: `/customers/${assessment.customer_id}`, className: "text-sm text-slate-500 hover:underline", children: "\u2190 Customer" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs text-slate-500", children: ["Status: ", assessment.status] }), _jsx("button", { onClick: async () => {
                                    if (!id)
                                        return;
                                    setGeneratingReport(true);
                                    try {
                                        if (assessment.status !== "Completed") {
                                            await api.completeAssessment(id);
                                        }
                                        const { id: reportId } = await api.createReport(id);
                                        nav(`/reports/${reportId}`);
                                    }
                                    catch (err) {
                                        setError(String(err));
                                        setGeneratingReport(false);
                                    }
                                }, disabled: generatingReport, className: "bg-emerald-700 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50", children: generatingReport ? "Generating…" : "Complete & generate report" })] })] }), _jsx("h1", { className: "text-2xl font-semibold", children: assessment.title }), _jsxs("div", { className: "mt-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4", children: [_jsx("nav", { className: "bg-white rounded shadow-sm p-2 h-fit md:sticky md:top-4 self-start", children: _jsx("ul", { className: "space-y-1", children: standards.map((s) => {
                                const t = totalsByStandard.get(s.id);
                                const isActive = s.id === activeStandard;
                                return (_jsx("li", { children: _jsxs("button", { onClick: () => setActiveStandard(s.id), className: `w-full text-left px-2 py-1.5 rounded text-sm ${isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`, children: [_jsx("span", { className: "font-medium", children: s.title }), _jsxs("span", { className: `ml-2 text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`, children: [t?.answered ?? 0, "/", t?.total ?? 0, t?.average != null && ` · L${t.average.toFixed(1)}`] })] }) }, s.id));
                            }) }) }), _jsxs("section", { className: "bg-white rounded shadow-sm p-4", children: [_jsxs("div", { className: "mb-3", children: [_jsx("h2", { className: "text-lg font-semibold", children: active.title }), _jsx("p", { className: "text-sm text-slate-600", children: active.summary }), _jsx("a", { href: active.gov_uk_url, target: "_blank", rel: "noreferrer", className: "text-xs text-slate-500 underline", children: "gov.uk source" })] }), _jsx("ol", { className: "space-y-4", children: active.subCriteria.map((sc) => (_jsx(SubCriterionRow, { assessmentId: id, sub: sc, response: responseBySub.get(sc.id), readOnly: assessment.status === "Completed", onChange: (r) => {
                                        setAssessmentResponses((prev) => {
                                            const filtered = prev.filter((p) => p.sub_criterion_id !== sc.id);
                                            return [...filtered, r];
                                        });
                                    } }, sc.id))) })] })] })] }));
}
function SubCriterionRow({ assessmentId, sub, response, readOnly, onChange, }) {
    const [rationale, setRationale] = useState(response?.rationale ?? "");
    const [evidenceLabel, setEvidenceLabel] = useState("");
    const [evidenceBody, setEvidenceBody] = useState("");
    const [evidenceKind, setEvidenceKind] = useState("Note");
    const [savingLevel, setSavingLevel] = useState(null);
    const saveLevel = async (level, notApplicable = false) => {
        setSavingLevel(level);
        try {
            await api.putResponse(assessmentId, sub.id, {
                level,
                notApplicable,
                rationale: rationale || null,
            });
            onChange({
                id: response?.id ?? sub.id,
                sub_criterion_id: sub.id,
                level,
                not_applicable: notApplicable,
                rationale: rationale || null,
                evidence: response?.evidence ?? [],
            });
        }
        finally {
            setSavingLevel(null);
        }
    };
    return (_jsxs("li", { className: "border rounded p-3", children: [_jsx("header", { className: "flex items-start justify-between gap-2", children: _jsxs("div", { children: [_jsxs("p", { className: "text-xs font-mono text-slate-500", children: [sub.code, sub.must_have && (_jsx("span", { className: "ml-2 inline-block px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[10px]", children: "MUST" }))] }), _jsx("p", { className: "font-medium", children: sub.text }), sub.rationale && (_jsx("p", { className: "text-xs italic text-slate-500 mt-1", children: sub.rationale }))] }) }), _jsx("div", { className: "mt-3 grid grid-cols-1 lg:grid-cols-5 gap-2", children: sub.descriptors
                    .sort((a, b) => a.level - b.level)
                    .map((d) => {
                    const selected = response?.level === d.level && !response?.not_applicable;
                    return (_jsxs("button", { type: "button", disabled: readOnly, onClick: () => saveLevel(d.level), className: `text-left text-xs p-2 rounded border ${selected
                            ? "border-sky-500 bg-sky-50 ring-2 ring-sky-300"
                            : "border-slate-200 hover:border-slate-400"} ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`, children: [_jsxs("div", { className: "font-semibold mb-1", children: ["L", d.level, savingLevel === d.level && " · saving…"] }), _jsx("div", { className: "text-slate-700", children: d.descriptor })] }, d.level));
                }) }), _jsx("div", { className: "mt-2 flex items-center gap-3 text-xs", children: _jsxs("label", { className: "flex items-center gap-1", children: [_jsx("input", { type: "checkbox", checked: response?.not_applicable ?? false, disabled: readOnly, onChange: (e) => saveLevel(null, e.target.checked) }), "Not applicable"] }) }), _jsx("textarea", { placeholder: "Rationale / context for this score", value: rationale, disabled: readOnly, onChange: (e) => setRationale(e.target.value), onBlur: () => {
                    if (response) {
                        api.putResponse(assessmentId, sub.id, {
                            level: response.level ?? null,
                            notApplicable: response.not_applicable,
                            rationale: rationale || null,
                        });
                    }
                }, className: "mt-2 w-full border rounded px-2 py-1 text-sm", rows: 2 }), response && response.evidence.length > 0 && (_jsx("ul", { className: "mt-2 space-y-1", children: response.evidence.map((e) => (_jsxs("li", { className: "text-xs text-slate-700 bg-slate-50 rounded px-2 py-1", children: [_jsx("span", { className: "font-medium", children: e.label }), " ", e.kind === "Link" ? (_jsx("a", { className: "text-sky-700 underline", href: e.body, target: "_blank", rel: "noreferrer", children: e.body })) : (_jsxs("span", { children: ["\u2014 ", e.body] }))] }, e.id))) })), !readOnly && (_jsxs("form", { onSubmit: async (ev) => {
                    ev.preventDefault();
                    if (!evidenceLabel || !evidenceBody)
                        return;
                    await api.addEvidence(assessmentId, sub.id, {
                        kind: evidenceKind,
                        label: evidenceLabel,
                        body: evidenceBody,
                    });
                    // Refresh response list inline
                    const refreshed = await api.getAssessment(assessmentId);
                    const r = refreshed.responses.find((rr) => rr.sub_criterion_id === sub.id);
                    if (r)
                        onChange(r);
                    setEvidenceLabel("");
                    setEvidenceBody("");
                }, className: "mt-2 flex gap-2 text-xs", children: [_jsxs("select", { value: evidenceKind, onChange: (e) => setEvidenceKind(e.target.value), className: "border rounded px-1 bg-white", children: [_jsx("option", { value: "Note", children: "Note" }), _jsx("option", { value: "Link", children: "Link" })] }), _jsx("input", { value: evidenceLabel, onChange: (e) => setEvidenceLabel(e.target.value), placeholder: "Label", className: "border rounded px-2 py-1 w-32" }), _jsx("input", { value: evidenceBody, onChange: (e) => setEvidenceBody(e.target.value), placeholder: evidenceKind === "Link" ? "https://…" : "Evidence note", className: "border rounded px-2 py-1 flex-1" }), _jsx("button", { type: "submit", className: "bg-slate-200 px-2 py-1 rounded", children: "Add evidence" })] }))] }));
}
