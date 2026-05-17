import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CustomersPage } from "./pages/CustomersPage";
import { CustomerDetailPage } from "./pages/CustomerDetailPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { ReportPage } from "./pages/ReportPage";
export function App() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/", element: _jsx(CustomersPage, {}) }), _jsx(Route, { path: "/customers/:id", element: _jsx(CustomerDetailPage, {}) }), _jsx(Route, { path: "/assessments/:id", element: _jsx(AssessmentPage, {}) }), _jsx(Route, { path: "/reports/:id", element: _jsx(ReportPage, {}) })] }) }));
}
