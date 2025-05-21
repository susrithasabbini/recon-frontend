import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home";
import MainProcessFlowPage from "./pages/MainProcessFlowPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<MainProcessFlowPage />} path="/process-flow" />
    </Routes>
  );
}
