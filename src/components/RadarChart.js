import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function RadarChart({ points, max = 5, size = 480, }) {
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 80;
    const n = points.length;
    const angle = (i) => (i / n) * Math.PI * 2 - Math.PI / 2;
    const point = (i, value) => {
        const a = angle(i);
        const rr = (value / max) * r;
        return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    };
    const grid = [1, 2, 3, 4, 5].map((step) => (_jsx("polygon", { fill: "none", stroke: "#cbd5e1", strokeDasharray: step === max ? "" : "3 3", points: Array.from({ length: n })
            .map((_, i) => {
            const a = angle(i);
            const rr = (step / max) * r;
            return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
        })
            .join(" ") }, step)));
    const axes = points.map((_, i) => {
        const [x, y] = point(i, max);
        return _jsx("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "#cbd5e1" }, i);
    });
    const labels = points.map((p, i) => {
        const a = angle(i);
        const rr = r + 30;
        const x = cx + rr * Math.cos(a);
        const y = cy + rr * Math.sin(a);
        const anchor = Math.cos(a) > 0.2 ? "start" : Math.cos(a) < -0.2 ? "end" : "middle";
        const dy = Math.sin(a) > 0.5 ? "1em" : Math.sin(a) < -0.5 ? "-0.3em" : "0.35em";
        return (_jsx("text", { x: x, y: y, textAnchor: anchor, dy: dy, className: "fill-slate-700 text-[11px]", children: p.label }, i));
    });
    const filled = points.filter((p) => p.value != null);
    const dataPoly = filled.length === points.length
        ? points
            .map((p, i) => point(i, p.value ?? 0))
            .map(([x, y]) => `${x},${y}`)
            .join(" ")
        : "";
    return (_jsxs("svg", { viewBox: `0 0 ${size} ${size}`, className: "w-full h-auto max-w-[640px] mx-auto", role: "img", "aria-label": "Maturity radar chart", children: [grid, axes, dataPoly && (_jsx("polygon", { points: dataPoly, fill: "rgba(14, 165, 233, 0.25)", stroke: "#0ea5e9", strokeWidth: 2 })), points.map((p, i) => {
                if (p.value == null)
                    return null;
                const [x, y] = point(i, p.value);
                return _jsx("circle", { cx: x, cy: y, r: 4, fill: "#0ea5e9" }, i);
            }), labels] }));
}
