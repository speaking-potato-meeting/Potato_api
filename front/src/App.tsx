import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ReactRouterObject } from "./router";

/* React-Query */
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import CurrentUserContextProvider from "./context/CurrentUserContextProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrentUserContextProvider>
        <RouterProvider router={ReactRouterObject} />;
      </CurrentUserContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
