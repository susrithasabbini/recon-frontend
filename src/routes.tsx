import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home";
import MainProcessFlowPage from "./pages/main-process-flow-page";
import ViewTransactionsPage from "@/pages/view-transactions-page"; // Import the new page

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<MainProcessFlowPage />} path="/process-flow" />
      <Route element={<ViewTransactionsPage />} path="/transactions" /> {/* Add new route */}
    </Routes>
  );
}
