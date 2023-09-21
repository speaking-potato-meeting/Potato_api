import Home from "./pages/Home";
import StudyRules from "./pages/StudyRules";
import Members from "./pages/Members";
import StopWatch from "./pages/StopWatch";
import ToDo from "./pages/ToDo";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { createBrowserRouter } from "react-router-dom";
import { Router as RemixRouter } from "@remix-run/router/dist/router";
import Root from "./components/Layout/Root";
import Account from "./components/Layout/Account";
import GeneralLayout from "./components/Layout/GeneralLayout";

// withAuthorization: 로그인이 필요한가?

const routerData = [
  {
    id: 0,
    path: "/",
    element: <GeneralLayout />,
    withAuthorization: false,
    children: [
      {
        path: "",
        element: <Home />,
        withAuthorization: false,
        label: "Talking Potato 🥔",
      },
      {
        path: "study-rules",
        element: <StudyRules />,
        withAuthorization: false,
        label: "스터디 규칙 📝",
      },
      {
        path: "members",
        element: <Members />,
        withAuthorization: false,
        label: "멤버 소개 🧍🏻‍♂️",
      },
      {
        path: "todo",
        element: <ToDo />,
        withAuthorization: true,
        label: "To-do ☑️",
      },
      {
        path: "stop-watch",
        element: <StopWatch />,
        withAuthorization: true,
        label: "⏳",
      },
      {
        path: "my-page",
        element: <MyPage />,
        withAuthorization: true,
        label: "마이페이지",
      },
    ],
  },
  {
    id: 1,
    path: "account/",
    element: <Account />,
    children: [
      {
        path: "login",
        element: <Login />,
        withAuthorization: false,
        label: "로그인",
      },
      {
        path: "signup",
        element: <SignUp />,
        withAuthorization: false,
        label: "회원가입 ⭐️",
      },
    ],
  },
];

export const ReactRouterObject: RemixRouter = createBrowserRouter(
  routerData.map((router) => {
    if (router.withAuthorization) {
      return {
        path: router.path,
        element: <Root>{router.element}</Root>,
        children: router.children,
      };
    } else {
      return {
        path: router.path,
        element: router.element,
        children: router.children,
      };
    }
  })
);

type NavbarElement = {
  path: string;
  label: string;
};

export const NavbarContent: NavbarElement[] = routerData.reduce(
  (prev, router) => {
    if (router.children) {
      const childArr = router.children.map((r) => {
        return {
          path: router.path + r.path,
          label: r.label,
        };
      });
      return prev.concat(childArr);
    }
  },
  []
);

// export const NavbarContent: NavbarElement[] = routerData.map((router) => {
//   if (router.children) {
//     return router.children.map((r) => ({
//       path: router.path + r.path,
//       label: r.label,
//     }));
//   }
//   return [];
// });
// .flat();
