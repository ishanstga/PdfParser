import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import App from "./App.jsx";
import Downloads from "./Downloads.jsx";

export default function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/Application" element={<App />} />
        <Route path="/Downloads" element={<Downloads />} />
      </Routes>
    </BrowserRouter>
  );
}
