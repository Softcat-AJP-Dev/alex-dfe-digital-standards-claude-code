import { Hono } from "hono";
import { query, withClient } from "../db";
import { requireMember } from "../auth";
export const reportsRoutes = new Hono();
reportsRoutes.use("*", requireMember);
// Generate a frozen report snapshot from the current state of an assessment.
// The snapshot is stored as JSON so the report stays stable even if gov.uk
// publishes a new StandardsVersion.
reportsRoutes.post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    if (!body.assessmentId)
        return c.json({ error: "assessment_id_required" }, 400);
    return withClient(async (client) => {
        const own = await client.query(`SELECT a.id, a.title, a.version_id
         FROM assessment a
         JOIN customer c ON c.id = a.customer_id
        WHERE a.id = $1 AND c.owner_oid = $2`, [body.assessmentId, user.oid]);
        if (own.rowCount === 0)
            return c.json({ error: "not_found" }, 404);
        const standards = await client.query(`SELECT id, slug, title, category, summary, gov_uk_url, weight, order_index
         FROM standard
        WHERE version_id = $1
        ORDER BY order_index`, [own.rows[0].version_id]);
        const subs = await client.query(`SELECT sc.id, sc.standard_id, sc.code, sc.text, sc.weight, sc.order_index
         FROM sub_criterion sc
         JOIN standard s ON s.id = sc.standard_id
        WHERE s.version_id = $1
        ORDER BY s.order_index, sc.order_index`, [own.rows[0].version_id]);
        const descriptors = await client.query(`SELECT ld.sub_criterion_id, ld.level, ld.descriptor
         FROM level_descriptor ld
         JOIN sub_criterion sc ON sc.id = ld.sub_criterion_id
         JOIN standard s ON s.id = sc.standard_id
        WHERE s.version_id = $1`, [own.rows[0].version_id]);
        const responses = await client.query(`SELECT sub_criterion_id, level, not_applicable, rationale
         FROM response
        WHERE assessment_id = $1`, [body.assessmentId]);
        const responseBySub = new Map(responses.rows.map((r) => [r.sub_criterion_id, r]));
        const descriptorsBySub = new Map();
        for (const d of descriptors.rows) {
            const arr = descriptorsBySub.get(d.sub_criterion_id) ?? [];
            arr.push({ level: d.level, descriptor: d.descriptor });
            descriptorsBySub.set(d.sub_criterion_id, arr);
        }
        const subsByStandard = new Map();
        for (const s of subs.rows) {
            const arr = subsByStandard.get(s.standard_id) ?? [];
            arr.push(s);
            subsByStandard.set(s.standard_id, arr);
        }
        const scoredStandards = standards.rows.map((std) => {
            const stdSubs = subsByStandard.get(std.id) ?? [];
            const subCriteria = stdSubs.map((sc) => {
                const r = responseBySub.get(sc.id);
                return {
                    code: sc.code,
                    text: sc.text,
                    weight: sc.weight,
                    level: r?.level ?? null,
                    notApplicable: r?.not_applicable ?? false,
                    rationale: r?.rationale ?? null,
                    descriptors: (descriptorsBySub.get(sc.id) ?? []).sort((a, b) => a.level - b.level),
                };
            });
            // Weighted average across answered, non-NA sub-criteria.
            const scored = subCriteria.filter((sc) => sc.level != null && !sc.notApplicable);
            const totalWeight = scored.reduce((s, sc) => s + sc.weight, 0);
            const weightedSum = scored.reduce((s, sc) => s + sc.weight * (sc.level ?? 0), 0);
            const averageLevel = scored.length ? weightedSum / totalWeight : null;
            return {
                slug: std.slug,
                title: std.title,
                category: std.category,
                weight: std.weight,
                govUkUrl: std.gov_uk_url,
                averageLevel,
                weightedScore: averageLevel != null ? averageLevel * std.weight : null,
                subCriteria,
            };
        });
        // Overall = weighted average of standards that have at least one answered
        // sub-criterion. Standards with no answers don't contribute.
        const standardsWithScores = scoredStandards.filter((s) => s.averageLevel != null);
        const overallNumerator = standardsWithScores.reduce((acc, s) => acc + (s.averageLevel ?? 0) * s.weight, 0);
        const overallDenom = standardsWithScores.reduce((acc, s) => acc + s.weight, 0);
        const overallScore = overallDenom > 0 ? overallNumerator / overallDenom : 0;
        const snapshot = {
            assessmentTitle: own.rows[0].title,
            generatedAt: new Date().toISOString(),
            generatedByEmail: user.email,
            standards: scoredStandards,
            overallScore,
        };
        const r = await client.query(`INSERT INTO report (assessment_id, generated_by_oid, snapshot, overall_score)
       VALUES ($1, $2, $3, $4)
       RETURNING id`, [body.assessmentId, user.oid, snapshot, overallScore]);
        return c.json({ id: r.rows[0].id });
    });
});
reportsRoutes.get("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const r = await query(`SELECT r.id, r.generated_at, r.overall_score, r.snapshot
       FROM report r
       JOIN assessment a ON a.id = r.assessment_id
       JOIN customer c ON c.id = a.customer_id
      WHERE r.id = $1 AND c.owner_oid = $2`, [id, user.oid]);
    if (r.rowCount === 0)
        return c.json({ error: "not_found" }, 404);
    return c.json(r.rows[0]);
});
