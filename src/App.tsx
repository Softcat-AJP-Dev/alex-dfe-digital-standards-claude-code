import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CustomersPage } from "./pages/CustomersPage";
import { CustomerDetailPage } from "./pages/CustomerDetailPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { ReportPage } from "./pages/ReportPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/assessments/:id" element={<AssessmentPage />} />
        <Route path="/reports/:id" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}
