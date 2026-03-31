import Providers from "../../src/App/providers";
import AppRoutes from "../../src/routes";

export default function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}