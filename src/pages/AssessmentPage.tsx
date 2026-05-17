import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  api,
  type Assessment,
  type Response,
  type StandardWithSubs,
  type SubCriterionWithDescriptors,
} from "../api";

export function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [standards, setStandards] = useState<StandardWithSubs[]>([]);
  const [activeStandard, setActiveStandard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getAssessment(id), api.getStandards()])
      .then(([a, s]) => {
        setAssessment(a.assessment);
        setResponses(a.responses);
        setStandards(s.standards);
        if (s.standards.length > 0) setActiveStandard(s.standards[0].id);
      })
      .catch((err) => setError(String(err)));
  }, [id]);

  const responseBySub = useMemo(() => {
    const m = new Map<string, Response>();
    for (const r of responses) m.set(r.sub_criterion_id, r);
    return m;
  }, [responses]);

  const totalsByStandard = useMemo(() => {
    const out = new Map<string, { answered: number; total: number; average: number | null }>();
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

  if (error) return <p className="text-red-700">{error}</p>;
  if (!assessment || !standards.length) return <p className="text-slate-500 text-sm">Loading…</p>;

  const active = standards.find((s) => s.id === activeStandard) ?? standards[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Link to={`/customers/${assessment.customer_id}`} className="text-sm text-slate-500 hover:underline">
          ← Customer
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status: {assessment.status}</span>
          <button
            onClick={async () => {
              if (!id) return;
              setGeneratingReport(true);
              try {
                if (assessment.status !== "Completed") {
                  await api.completeAssessment(id);
                }
                const { id: reportId } = await api.createReport(id);
                nav(`/reports/${reportId}`);
              } catch (err) {
                setError(String(err));
                setGeneratingReport(false);
              }
            }}
            disabled={generatingReport}
            className="bg-emerald-700 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
          >
            {generatingReport ? "Generating…" : "Complete & generate report"}
          </button>
        </div>
      </div>
      <h1 className="text-2xl font-semibold">{assessment.title}</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4">
        <nav className="bg-white rounded shadow-sm p-2 h-fit md:sticky md:top-4 self-start">
          <ul className="space-y-1">
            {standards.map((s) => {
              const t = totalsByStandard.get(s.id);
              const isActive = s.id === activeStandard;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setActiveStandard(s.id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                      isActive ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-medium">{s.title}</span>
                    <span className={`ml-2 text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      {t?.answered ?? 0}/{t?.total ?? 0}
                      {t?.average != null && ` · L${t.average.toFixed(1)}`}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section className="bg-white rounded shadow-sm p-4">
          <div className="mb-3">
            <h2 className="text-lg font-semibold">{active.title}</h2>
            <p className="text-sm text-slate-600">{active.summary}</p>
            <a
              href={active.gov_uk_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 underline"
            >
              gov.uk source
            </a>
          </div>
          <ol className="space-y-4">
            {active.subCriteria.map((sc) => (
              <SubCriterionRow
                key={sc.id}
                assessmentId={id!}
                sub={sc}
                response={responseBySub.get(sc.id)}
                readOnly={assessment.status === "Completed"}
                onChange={(r) => {
                  setResponses((prev) => {
                    const filtered = prev.filter((p) => p.sub_criterion_id !== sc.id);
                    return [...filtered, r];
                  });
                }}
              />
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function SubCriterionRow({
  assessmentId,
  sub,
  response,
  readOnly,
  onChange,
}: {
  assessmentId: string;
  sub: SubCriterionWithDescriptors;
  response?: Response;
  readOnly: boolean;
  onChange: (r: Response) => void;
}) {
  const [rationale, setRationale] = useState(response?.rationale ?? "");
  const [evidenceLabel, setEvidenceLabel] = useState("");
  const [evidenceBody, setEvidenceBody] = useState("");
  const [evidenceKind, setEvidenceKind] = useState<"Note" | "Link">("Note");
  const [savingLevel, setSavingLevel] = useState<number | null>(null);

  const saveLevel = async (level: number | null, notApplicable = false) => {
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
    } finally {
      setSavingLevel(null);
    }
  };

  return (
    <li className="border rounded p-3">
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-mono text-slate-500">
            {sub.code}
            {sub.must_have && (
              <span className="ml-2 inline-block px-1.5 py-0.5 bg-red-100 text-red-800 rounded text-[10px]">
                MUST
              </span>
            )}
          </p>
          <p className="font-medium">{sub.text}</p>
          {sub.rationale && (
            <p className="text-xs italic text-slate-500 mt-1">{sub.rationale}</p>
          )}
        </div>
      </header>

      <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-2">
        {sub.descriptors
          .sort((a, b) => a.level - b.level)
          .map((d) => {
            const selected = response?.level === d.level && !response?.not_applicable;
            return (
              <button
                key={d.level}
                type="button"
                disabled={readOnly}
                onClick={() => saveLevel(d.level)}
                className={`text-left text-xs p-2 rounded border ${
                  selected
                    ? "border-sky-500 bg-sky-50 ring-2 ring-sky-300"
                    : "border-slate-200 hover:border-slate-400"
                } ${readOnly ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="font-semibold mb-1">
                  L{d.level}
                  {savingLevel === d.level && " · saving…"}
                </div>
                <div className="text-slate-700">{d.descriptor}</div>
              </button>
            );
          })}
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={response?.not_applicable ?? false}
            disabled={readOnly}
            onChange={(e) => saveLevel(null, e.target.checked)}
          />
          Not applicable
        </label>
      </div>

      <textarea
        placeholder="Rationale / context for this score"
        value={rationale}
        disabled={readOnly}
        onChange={(e) => setRationale(e.target.value)}
        onBlur={() => {
          if (response) {
            api.putResponse(assessmentId, sub.id, {
              level: response.level ?? null,
              notApplicable: response.not_applicable,
              rationale: rationale || null,
            });
          }
        }}
        className="mt-2 w-full border rounded px-2 py-1 text-sm"
        rows={2}
      />

      {response && response.evidence.length > 0 && (
        <ul className="mt-2 space-y-1">
          {response.evidence.map((e) => (
            <li key={e.id} className="text-xs text-slate-700 bg-slate-50 rounded px-2 py-1">
              <span className="font-medium">{e.label}</span>{" "}
              {e.kind === "Link" ? (
                <a className="text-sky-700 underline" href={e.body} target="_blank" rel="noreferrer">
                  {e.body}
                </a>
              ) : (
                <span>— {e.body}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {!readOnly && (
        <form
          onSubmit={async (ev) => {
            ev.preventDefault();
            if (!evidenceLabel || !evidenceBody) return;
            await api.addEvidence(assessmentId, sub.id, {
              kind: evidenceKind,
              label: evidenceLabel,
              body: evidenceBody,
            });
            // Refresh response list inline
            const refreshed = await api.getAssessment(assessmentId);
            const r = refreshed.responses.find((rr) => rr.sub_criterion_id === sub.id);
            if (r) onChange(r);
            setEvidenceLabel("");
            setEvidenceBody("");
          }}
          className="mt-2 flex gap-2 text-xs"
        >
          <select
            value={evidenceKind}
            onChange={(e) => setEvidenceKind(e.target.value as "Note" | "Link")}
            className="border rounded px-1 bg-white"
          >
            <option value="Note">Note</option>
            <option value="Link">Link</option>
          </select>
          <input
            value={evidenceLabel}
            onChange={(e) => setEvidenceLabel(e.target.value)}
            placeholder="Label"
            className="border rounded px-2 py-1 w-32"
          />
          <input
            value={evidenceBody}
            onChange={(e) => setEvidenceBody(e.target.value)}
            placeholder={evidenceKind === "Link" ? "https://…" : "Evidence note"}
            className="border rounded px-2 py-1 flex-1"
          />
          <button type="submit" className="bg-slate-200 px-2 py-1 rounded">
            Add evidence
          </button>
        </form>
      )}
    </li>
  );
}
