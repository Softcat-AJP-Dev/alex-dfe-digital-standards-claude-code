import { Hono } from "hono";
import { query } from "../db";
export const standardsRoutes = new Hono();
// GET /api/standards/current — returns the current StandardsVersion + nested
// standards, sub-criteria and level descriptors. The frontend renders the
// assessment form from this; it's mostly read-only and cacheable.
standardsRoutes.get("/current", async (c) => {
    const version = await query(`SELECT id, version, published_at
       FROM standards_version
       ORDER BY published_at DESC
       LIMIT 1`);
    if (version.rowCount === 0)
        return c.json({ error: "no_standards_seeded" }, 404);
    const v = version.rows[0];
    const standards = await query(`SELECT id, slug, title, category, summary, gov_uk_url, weight, order_index
       FROM standard
      WHERE version_id = $1
      ORDER BY order_index`, [v.id]);
    const subs = await query(`SELECT sc.id, sc.standard_id, sc.code, sc.text, sc.rationale,
            sc.must_have, sc.weight, sc.order_index
       FROM sub_criterion sc
       JOIN standard s ON s.id = sc.standard_id
      WHERE s.version_id = $1
      ORDER BY s.order_index, sc.order_index`, [v.id]);
    const descriptors = await query(`SELECT ld.id, ld.sub_criterion_id, ld.level, ld.descriptor, ld.evidence_hints
       FROM level_descriptor ld
       JOIN sub_criterion sc ON sc.id = ld.sub_criterion_id
       JOIN standard s ON s.id = sc.standard_id
      WHERE s.version_id = $1
      ORDER BY ld.level`, [v.id]);
    const descriptorsBySub = new Map();
    for (const d of descriptors.rows) {
        const arr = descriptorsBySub.get(d.sub_criterion_id) ?? [];
        arr.push(d);
        descriptorsBySub.set(d.sub_criterion_id, arr);
    }
    const subsByStandard = new Map();
    for (const s of subs.rows) {
        const arr = subsByStandard.get(s.standard_id) ?? [];
        arr.push(s);
        subsByStandard.set(s.standard_id, arr);
    }
    const enriched = standards.rows.map((s) => ({
        ...s,
        subCriteria: (subsByStandard.get(s.id) ?? []).map((sc) => ({
            ...sc,
            descriptors: descriptorsBySub.get(sc.id) ?? [],
        })),
    }));
    return c.json({ version: v, standards: enriched });
});
