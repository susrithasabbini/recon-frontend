import { BrowserRouter as Router } from "react-router-dom";
import { DefaultReconProvider } from "@/contexts/default-context";
import { Provider } from "@/provider";
import { ColorThemeProvider } from "@/contexts/color-theme-context"; // Added import
import AppRoutes from "@/routes";
export default function App() {
  return (
    <Router>
      <Provider>
        <ColorThemeProvider>
          {" "}
          {/* Added Provider */}
          <DefaultReconProvider>
            <AppRoutes />
          </DefaultReconProvider>
        </ColorThemeProvider>{" "}
        {/* Added Provider */}
      </Provider>
    </Router>
  );
}
