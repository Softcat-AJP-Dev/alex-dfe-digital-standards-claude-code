import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Customer, type SchoolPhase } from "../api";

const PHASES: { value: SchoolPhase; label: string }[] = [
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "AllThrough", label: "All-through" },
  { value: "FE", label: "Further Education" },
  { value: "SpecialSEND", label: "Special / SEND" },
];

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm"
        >
          {showNew ? "Cancel" : "+ New customer"}
        </button>
      </div>

      {showNew && (
        <NewCustomerForm
          onCreated={() => {
            setShowNew(false);
            refresh();
          }}
        />
      )}

      {error && <p className="text-red-700 text-sm">{error}</p>}
      {loading && !error && <p className="text-slate-500 text-sm">Loading…</p>}
      {!loading && customers.length === 0 && !error && (
        <p className="text-slate-500 text-sm">
          No customers yet. Add one to start an assessment.
        </p>
      )}

      <ul className="divide-y bg-white rounded shadow-sm">
        {customers.map((c) => (
          <li key={c.id} className="px-4 py-3 flex items-center justify-between">
            <div>
              <Link
                to={`/customers/${c.id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {c.name}
              </Link>
              <div className="text-xs text-slate-500">
                {c.phase}
                {c.urn && ` · URN ${c.urn}`}
                {c.trust_name && ` · ${c.trust_name}`}
              </div>
            </div>
            <span className="text-xs text-slate-400">
              {new Date(c.created_at).toLocaleDateString("en-GB")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewCustomerForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [urn, setUrn] = useState("");
  const [phase, setPhase] = useState<SchoolPhase>("Primary");
  const [trustName, setTrustName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={async (e) => {
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
        } catch (err) {
          setError(String(err));
        } finally {
          setSubmitting(false);
        }
      }}
      className="bg-white border rounded p-4 mb-4 space-y-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm">
          School name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </label>
        <label className="text-sm">
          Phase
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value as SchoolPhase)}
            className="mt-1 w-full border rounded px-2 py-1 bg-white"
          >
            {PHASES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          URN <span className="text-slate-400">(optional)</span>
          <input
            value={urn}
            onChange={(e) => setUrn(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </label>
        <label className="text-sm">
          Trust / MAT <span className="text-slate-400">(optional)</span>
          <input
            value={trustName}
            onChange={(e) => setTrustName(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </label>
      </div>
      {error && <p className="text-red-700 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
      >
        {submitting ? "Creating…" : "Create customer"}
      </button>
    </form>
  );
}
