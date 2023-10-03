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
    path: "/",
    element: <GeneralLayout />,
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
        withAuthorization: false,
        label: "To-do ☑️",
      },
      {
        path: "stop-watch",
        element: <StopWatch />,
        withAuthorization: false,
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

function checkAuthorize(routerData) {
  const newRouter = routerData.map((router) => {
    if (router.children) {
      const newChild = router.children.map((r) => {
        if (r.withAuthorization) {
          return {
            path: r.path,
            element: <Root>{r.element}</Root>,
            label: r.label,
          };
        }
        return {
          path: r.path,
          element: r.element,
          label: r.label,
        };
      });
      return {
        ...router,
        children: newChild,
      };
    }
    return router;
  });
  return newRouter;
}

// console.log(checkAuthorize(routerData));

export const ReactRouterObject: RemixRouter = createBrowserRouter(
  checkAuthorize(routerData)
);

export type NavbarElement = {
  path: string;
  label: string;
  withAuth: boolean;
};

export const NavbarContent: NavbarElement[] = routerData.reduce(
  (prev, router) => {
    /* 로그인, 회원가입 페이지 사이드바에서 제외 */
    if (router.path === "account/") return prev;

    if (router.children) {
      const childArr = router.children.map((r) => {
        return {
          path: router.path + r.path,
          label: r.label,
          withAuth: r.withAuthorization,
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
//   return [].flat();
// });
