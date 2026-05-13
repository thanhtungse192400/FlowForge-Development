import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../../src/features/HomePage/components/HomePage";
import CollectionPage from "../features/HomePage/components/Collection/CollectionPage";
import SmoothLayout from "../shared/components/Effect/SmoothLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
        path="/"
        element={
          <SmoothLayout>
            <HomePage />
          </SmoothLayout>
        }
      />

      <Route path="/Collection"element={<CollectionPage />}/></Routes>
    </BrowserRouter>
  );
}