// Every API path is prefixed with the platform sub-path. In local dev,
// vite.config.ts proxies these to the Hono server on :8787.
const API_BASE = "/alex/dfe-digital-standards-claude-code/api";

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Read the body once as text, then try to parse — calling .json()
    // first and falling back to .text() consumes the stream and the
    // fallback throws "body stream already read", which masks whatever
    // the server actually returned.
    const raw = await res.text();
    let detail = raw;
    try {
      detail = JSON.stringify(JSON.parse(raw));
    } catch {
      // Body wasn't JSON — show the raw text (or "<empty>") as-is.
      detail = raw || "<empty body>";
    }
    throw new Error(`HTTP ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  me: () => fetch(`${API_BASE}/me`).then(jsonOrThrow<{ email: string; oid: string }>),

  health: () =>
    fetch(`${API_BASE}/health`).then(jsonOrThrow<{ ok: boolean; now?: string; error?: string }>),

  listCustomers: () => fetch(`${API_BASE}/customers`).then(jsonOrThrow<Customer[]>),

  createCustomer: (body: {
    name: string;
    urn?: string;
    phase: SchoolPhase;
    trustName?: string;
  }) =>
    fetch(`${API_BASE}/customers`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(jsonOrThrow<{ id: string }>),

  getCustomer: (id: string) =>
    fetch(`${API_BASE}/customers/${id}`).then(
      jsonOrThrow<{ customer: Customer; assessments: AssessmentSummary[] }>,
    ),

  createAssessment: (body: { customerId: string; title: string }) =>
    fetch(`${API_BASE}/assessments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(jsonOrThrow<{ id: string }>),

  getAssessment: (id: string) =>
    fetch(`${API_BASE}/assessments/${id}`).then(
      jsonOrThrow<{ assessment: Assessment; responses: AssessmentResponse[] }>,
    ),

  putResponse: (
    assessmentId: string,
    subCriterionId: string,
    body: { level?: number | null; notApplicable?: boolean; rationale?: string | null },
  ) =>
    fetch(`${API_BASE}/assessments/${assessmentId}/responses/${subCriterionId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }).then(jsonOrThrow<{ id: string }>),

  addEvidence: (
    assessmentId: string,
    subCriterionId: string,
    body: { kind: "Note" | "Link" | "InlineFile"; label: string; body: string },
  ) =>
    fetch(
      `${API_BASE}/assessments/${assessmentId}/responses/${subCriterionId}/evidence`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    ).then(jsonOrThrow<{ id: string }>),

  completeAssessment: (id: string) =>
    fetch(`${API_BASE}/assessments/${id}/complete`, { method: "POST" }).then(
      jsonOrThrow<{ ok: true }>,
    ),

  getStandards: () =>
    fetch(`${API_BASE}/standards/current`).then(
      jsonOrThrow<{ version: VersionRow; standards: StandardWithSubs[] }>,
    ),

  createReport: (assessmentId: string) =>
    fetch(`${API_BASE}/reports`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ assessmentId }),
    }).then(jsonOrThrow<{ id: string }>),

  getReport: (id: string) =>
    fetch(`${API_BASE}/reports/${id}`).then(
      jsonOrThrow<{
        id: string;
        generated_at: string;
        overall_score: number;
        snapshot: ReportSnapshot;
      }>,
    ),
};

// --- Shared types ----------------------------------------------------

export type SchoolPhase = "Primary" | "Secondary" | "AllThrough" | "FE" | "SpecialSEND";

export type Customer = {
  id: string;
  name: string;
  urn: string | null;
  phase: SchoolPhase;
  trust_name: string | null;
  created_at: string;
  updated_at: string;
};

export type AssessmentSummary = {
  id: string;
  title: string;
  status: "InProgress" | "Completed" | "Archived";
  started_at: string;
  completed_at: string | null;
};

export type Assessment = AssessmentSummary & {
  customer_id: string;
  version_id: string;
  notes: string | null;
};

export type Evidence = {
  id: string;
  kind: "Note" | "Link" | "InlineFile";
  label: string;
  body: string;
  createdAt: string;
};

export type AssessmentResponse = {
  id: string;
  sub_criterion_id: string;
  level: number | null;
  not_applicable: boolean;
  rationale: string | null;
  evidence: Evidence[];
};

export type VersionRow = { id: string; version: string; published_at: string };

export type LevelDescriptor = {
  id: string;
  level: number;
  descriptor: string;
  evidence_hints: string | null;
};

export type SubCriterionWithDescriptors = {
  id: string;
  standard_id: string;
  code: string;
  text: string;
  rationale: string | null;
  must_have: boolean;
  weight: number;
  order_index: number;
  descriptors: LevelDescriptor[];
};

export type StandardWithSubs = {
  id: string;
  slug: string;
  title: string;
  category: "Core" | "Additional";
  summary: string;
  gov_uk_url: string;
  weight: number;
  order_index: number;
  subCriteria: SubCriterionWithDescriptors[];
};

export type ReportSnapshot = {
  assessmentTitle: string;
  generatedAt: string;
  generatedByEmail: string;
  overallScore: number;
  standards: {
    slug: string;
    title: string;
    category: "Core" | "Additional";
    weight: number;
    govUkUrl: string;
    averageLevel: number | null;
    weightedScore: number | null;
    subCriteria: {
      code: string;
      text: string;
      weight: number;
      level: number | null;
      notApplicable: boolean;
      rationale: string | null;
      descriptors: { level: number; descriptor: string }[];
    }[];
  }[];
};
