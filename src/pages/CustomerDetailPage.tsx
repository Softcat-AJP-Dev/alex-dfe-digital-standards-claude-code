import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, type AssessmentSummary, type Customer } from "../api";

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState(() => `Assessment – ${new Date().toLocaleDateString("en-GB")}`);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getCustomer(id)
      .then((data) => {
        setCustomer(data.customer);
        setAssessments(data.assessments);
      })
      .catch((err) => setError(String(err)));
  }, [id]);

  if (error) return <p className="text-red-700">{error}</p>;
  if (!customer) return <p className="text-slate-500 text-sm">Loading…</p>;

  return (
    <div>
      <Link to="/" className="text-sm text-slate-500 hover:underline">
        ← All customers
      </Link>
      <h1 className="text-2xl font-semibold mt-2">{customer.name}</h1>
      <p className="text-sm text-slate-500">
        {customer.phase}
        {customer.urn && ` · URN ${customer.urn}`}
        {customer.trust_name && ` · ${customer.trust_name}`}
      </p>

      <div className="mt-6 bg-white rounded shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Assessments</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!id) return;
              setCreating(true);
              try {
                const { id: newId } = await api.createAssessment({
                  customerId: id,
                  title,
                });
                nav(`/assessments/${newId}`);
              } catch (err) {
                setError(String(err));
              } finally {
                setCreating(false);
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
              placeholder="Assessment title"
            />
            <button
              type="submit"
              disabled={creating}
              className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
            >
              {creating ? "Creating…" : "+ Start assessment"}
            </button>
          </form>
        </div>

        {assessments.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No assessments yet. Start one to walk this school through the standards.
          </p>
        ) : (
          <ul className="divide-y">
            {assessments.map((a) => (
              <li key={a.id} className="py-2 flex items-center justify-between">
                <Link to={`/assessments/${a.id}`} className="hover:underline">
                  <span className="font-medium">{a.title}</span>
                  <span className="ml-2 text-xs text-slate-500">{a.status}</span>
                </Link>
                <span className="text-xs text-slate-400">
                  {new Date(a.started_at).toLocaleDateString("en-GB")}
                  {a.completed_at &&
                    ` → ${new Date(a.completed_at).toLocaleDateString("en-GB")}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
