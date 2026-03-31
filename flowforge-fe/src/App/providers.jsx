import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../../src/features/auth/AuthProvider";

//Cache API,Tự refetch,Sync UI với server
const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}