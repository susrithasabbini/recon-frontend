import { BrowserRouter as Router } from "react-router-dom";
import { DefaultReconProvider } from "@/contexts/default-context";
import { Provider } from "@/provider";
import AppRoutes from "@/routes";
export default function App() {
  return (
    <Router>
      <Provider>
        <DefaultReconProvider>
          <AppRoutes />
        </DefaultReconProvider>
      </Provider>
    </Router>
  );
}
