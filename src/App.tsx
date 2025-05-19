import { Route, Routes } from "react-router-dom";

import HomePage from "@/pages/home";
import AccountCreationPage from "@/pages/account-creation";
import RulesMappingPage from "@/pages/rules-mapping";
import FileUploadPage from "@/pages/file-upload";

function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<AccountCreationPage />} path="/account-creation" />
      <Route element={<RulesMappingPage />} path="/rules-mapping" />
      <Route element={<FileUploadPage />} path="/file-upload" />
    </Routes>
  );
}

export default App;
