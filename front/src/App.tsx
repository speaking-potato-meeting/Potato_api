import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ReactRouterObject } from "./router";

/* React-Query */
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={ReactRouterObject} />;
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
