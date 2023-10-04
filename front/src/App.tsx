import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { ReactRouterObject } from "./router";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     errorElement: <div>잘못된 주소입니다. 다시 입력해주세요! 🫠</div>,
//     children: [
//       { index: true, element: <Home /> },
//       { path: "/study-rules", element: <StudyRules /> },
//       { path: "/members", element: <Members /> },
//       { path: "/todo", element: <ToDo /> },
//       { path: "/stop-watch", element: <StopWatch /> },
//       { path: "/my-page", element: <MyPage /> },
//       { path: "/login", element: <Login /> },
//       { path: "/signup", element: <SignUp /> },
//     ],
//   },
// ]);

const App = () => {
  return (
    <div>
      <RouterProvider router={ReactRouterObject} />
    </div>
  );
};

export default App;
