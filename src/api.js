// Every API path is prefixed with the platform sub-path. In local dev,
// vite.config.ts proxies these to the Hono server on :8787.
const API_BASE = "/alex/dfe-digital-standards-claude-code/api";
async function jsonOrThrow(res) {
    if (!res.ok) {
        let detail;
        try {
            const j = await res.json();
            detail = JSON.stringify(j);
        }
        catch {
            detail = await res.text();
        }
        throw new Error(`HTTP ${res.status}: ${detail}`);
    }
    return res.json();
}
export const api = {
    me: () => fetch(`${API_BASE}/me`).then((jsonOrThrow)),
    health: () => fetch(`${API_BASE}/health`).then((jsonOrThrow)),
    listCustomers: () => fetch(`${API_BASE}/customers`).then((jsonOrThrow)),
    createCustomer: (body) => fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }).then((jsonOrThrow)),
    getCustomer: (id) => fetch(`${API_BASE}/customers/${id}`).then((jsonOrThrow)),
    createAssessment: (body) => fetch(`${API_BASE}/assessments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }).then((jsonOrThrow)),
    getAssessment: (id) => fetch(`${API_BASE}/assessments/${id}`).then((jsonOrThrow)),
    putResponse: (assessmentId, subCriterionId, body) => fetch(`${API_BASE}/assessments/${assessmentId}/responses/${subCriterionId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }).then((jsonOrThrow)),
    addEvidence: (assessmentId, subCriterionId, body) => fetch(`${API_BASE}/assessments/${assessmentId}/responses/${subCriterionId}/evidence`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }).then((jsonOrThrow)),
    completeAssessment: (id) => fetch(`${API_BASE}/assessments/${id}/complete`, { method: "POST" }).then((jsonOrThrow)),
    getStandards: () => fetch(`${API_BASE}/standards/current`).then((jsonOrThrow)),
    createReport: (assessmentId) => fetch(`${API_BASE}/reports`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assessmentId }),
    }).then((jsonOrThrow)),
    getReport: (id) => fetch(`${API_BASE}/reports/${id}`).then((jsonOrThrow)),
};
