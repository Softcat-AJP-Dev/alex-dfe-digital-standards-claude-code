import { Hono } from "hono";
import { query } from "../db";
import { requireMember } from "../auth";
export const customersRoutes = new Hono();
customersRoutes.use("*", requireMember);
// List customers owned by the current consultant.
customersRoutes.get("/", async (c) => {
    const user = c.get("user");
    const r = await query(`SELECT id, name, urn, phase, trust_name, created_at, updated_at
       FROM customer
      WHERE owner_oid = $1
      ORDER BY created_at DESC`, [user.oid]);
    return c.json(r.rows);
});
// Create a customer.
customersRoutes.post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json();
    if (!body.name || !body.phase) {
        return c.json({ error: "name_and_phase_required" }, 400);
    }
    const valid = ["Primary", "Secondary", "AllThrough", "FE", "SpecialSEND"];
    if (!valid.includes(body.phase)) {
        return c.json({ error: "invalid_phase" }, 400);
    }
    const r = await query(`INSERT INTO customer (name, urn, phase, trust_name, owner_oid, owner_email)
     VALUES ($1, $2, $3::"school_phase", $4, $5, $6)
     RETURNING id`, [body.name, body.urn ?? null, body.phase, body.trustName ?? null, user.oid, user.email]);
    return c.json({ id: r.rows[0].id });
});
// Customer detail with assessment list.
customersRoutes.get("/:id", async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");
    const cu = await query(`SELECT id, name, urn, phase, trust_name, created_at, updated_at
       FROM customer
      WHERE id = $1 AND owner_oid = $2`, [id, user.oid]);
    if (cu.rowCount === 0)
        return c.json({ error: "not_found" }, 404);
    const assessments = await query(`SELECT id, title, status, started_at, completed_at
       FROM assessment
      WHERE customer_id = $1
      ORDER BY started_at DESC`, [id]);
    return c.json({ customer: cu.rows[0], assessments: assessments.rows });
});
