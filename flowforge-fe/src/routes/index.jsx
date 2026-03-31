import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../src/features/HomePage/components/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}