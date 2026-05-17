import { Hono } from "hono";
import { query, withClient } from "../db";
import { requireMember } from "../auth";
export const assessmentsRoutes = new Hono();
assessmentsRoutes.use("*", requireMember);
// Start a new assessment against the latest StandardsVersion.
assessmentsRoutes.post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    if (!body.customerId || !body.title) {
        return c.json({ error: "customer_id_and_title_required" }, 400);
    }
    return withClient(async (client) => {
        const own = await client.query(`SELECT 1 FROM customer WHERE id = $1 AND owner_oid = $2`, [body.customerId, user.oid]);
        if (own.rowCount === 0)
            return c.json({ error: "not_found" }, 404);
        const v = await client.query(`SELECT id FROM standards_version ORDER BY published_at DESC LIMIT 1`);
        if (v.rowCount === 0)
            return c.json({ error: "no_standards_seeded" }, 404);
        const a = await client.query(`INSERT INTO assessment
         (customer_id, version_id, title, assessor_oid, assessor_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`, [body.customerId, v.rows[0].id, body.title, user.oid, user.email]);
        return c.json({ id: a.rows[0].id });
    });
});
// Get a single assessment with all responses.
assessmentsRoutes.get("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const a = await query(`SELECT a.id, a.customer_id, a.version_id, a.title, a.status,
            a.notes, a.started_at, a.completed_at
       FROM assessment a
       JOIN customer c ON c.id = a.customer_id
      WHERE a.id = $1 AND c.owner_oid = $2`, [id, user.oid]);
    if (a.rowCount === 0)
        return c.json({ error: "not_found" }, 404);
    const responses = await query(`SELECT r.id, r.sub_criterion_id, r.level, r.not_applicable, r.rationale,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', e.id,
                  'kind', e.kind,
                  'label', e.label,
                  'body', e.body,
                  'createdAt', e.created_at
                )
              ) FILTER (WHERE e.id IS NOT NULL),
              '[]'::json
            ) AS evidence
       FROM response r
       LEFT JOIN evidence e ON e.response_id = r.id
      WHERE r.assessment_id = $1
      GROUP BY r.id`, [id]);
    return c.json({ assessment: a.rows[0], responses: responses.rows });
});
// Upsert a response (assessor scoring a sub-criterion).
assessmentsRoutes.put("/:id/responses/:subCriterionId", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const subId = c.req.param("subCriterionId");
    const body = await c.req.json();
    if (body.level != null && (body.level < 1 || body.level > 5)) {
        return c.json({ error: "level_out_of_range" }, 400);
    }
    // Ownership check
    const own = await query(`SELECT 1 FROM assessment a
       JOIN customer c ON c.id = a.customer_id
      WHERE a.id = $1 AND c.owner_oid = $2`, [id, user.oid]);
    if (own.rowCount === 0)
        return c.json({ error: "not_found" }, 404);
    const r = await query(`INSERT INTO response (assessment_id, sub_criterion_id, level, not_applicable, rationale)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (assessment_id, sub_criterion_id)
     DO UPDATE SET level = EXCLUDED.level,
                   not_applicable = EXCLUDED.not_applicable,
                   rationale = EXCLUDED.rationale,
                   updated_at = NOW()
     RETURNING id`, [id, subId, body.level ?? null, body.notApplicable ?? false, body.rationale ?? null]);
    return c.json({ id: r.rows[0].id });
});
// Add a piece of evidence to a response.
assessmentsRoutes.post("/:id/responses/:subCriterionId/evidence", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const subId = c.req.param("subCriterionId");
    const body = await c.req.json();
    if (!body.kind || !body.label || !body.body) {
        return c.json({ error: "kind_label_body_required" }, 400);
    }
    if (!["Note", "Link", "InlineFile"].includes(body.kind)) {
        return c.json({ error: "invalid_kind" }, 400);
    }
    // Ownership check (joined via assessment -> customer)
    const r = await query(`WITH owned AS (
       SELECT a.id AS assessment_id
         FROM assessment a
         JOIN customer c ON c.id = a.customer_id
        WHERE a.id = $1 AND c.owner_oid = $2
     ),
     resp AS (
       SELECT id FROM response WHERE assessment_id = $1 AND sub_criterion_id = $3
     )
     INSERT INTO evidence (response_id, kind, label, body)
     SELECT r.id, $4::"evidence_kind", $5, $6
       FROM resp r
       JOIN owned o ON TRUE
     RETURNING id`, [id, user.oid, subId, body.kind, body.label, body.body]);
    if (r.rowCount === 0) {
        return c.json({ error: "response_not_found" }, 404);
    }
    return c.json({ id: r.rows[0].id });
});
// Mark an assessment complete (responses become read-only).
assessmentsRoutes.post("/:id/complete", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const r = await query(`UPDATE assessment
        SET status = 'Completed'::"assessment_status", completed_at = NOW()
       FROM customer c
      WHERE assessment.customer_id = c.id
        AND c.owner_oid = $2
        AND assessment.id = $1`, [id, user.oid]);
    if (r.rowCount === 0)
        return c.json({ error: "not_found" }, 404);
    return c.json({ ok: true });
});
