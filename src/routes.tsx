import { Route, Routes } from "react-router-dom";
import HomePage from "@/pages/home";
import MainProcessFlowPage from "./pages/main-process-flow-page";
import ViewTransactionsPage from "@/pages/view-transactions-page";
import AccountCreationPage from "@/pages/account-creation";
import DefaultLayout from "@/layouts/default";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <DefaultLayout>
            <HomePage />
          </DefaultLayout>
        }
        path="/"
      />
      <Route
        element={
          <DefaultLayout>
            <MainProcessFlowPage />
          </DefaultLayout>
        }
        path="/process-flow"
      />
      <Route
        element={
          <DefaultLayout>
            <ViewTransactionsPage />
          </DefaultLayout>
        }
        path="/transactions"
      />
      <Route
        element={
          <DefaultLayout>
            <AccountCreationPage />
          </DefaultLayout>
        }
        path="/accounts"
      />
    </Routes>
  );
}
