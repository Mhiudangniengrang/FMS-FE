import "./App.css";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "./routes/section";

function App() {
  return (
    <HelmetProvider>
      <div>
        <Router />
      </div>
    </HelmetProvider>
  );
}

export default App;
