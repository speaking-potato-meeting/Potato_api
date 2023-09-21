import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { NavbarContent } from "../../router";
import { useEffect } from "react";
import { getUser } from "../../api/signup";
import BottomTictoc from "../Timer/BottomTictoc";

type GeneralLayoutProps = {};

export default function GeneralLayout() {
  const fetchUser = async () => {
    const userRes = await getUser();
    return userRes;
  };

  let currentPath = useLocation();
  useEffect(() => {
    fetchUser();
  }, [currentPath]);

  const isStopWatch = currentPath.pathname === '/stop-watch';

  return (
    <>
      <Navbar NavbarContent={NavbarContent} />
      <Outlet />
      {!isStopWatch && <BottomTictoc/>}
    </>
  );
}


// import { Outlet, useLocation } from "react-router-dom";
// import Navbar from "../Navbar";
// import { NavbarContent } from "../../router";
// import { useEffect, useState } from "react"; // useState 추가
// import { getUser } from "../../api/signup";
// import BottomTictoc from "../Timer/BottomTictoc";

// type GeneralLayoutProps = {};

// export default function GeneralLayout() {
//   const fetchUser = async () => {
//     const userRes = await getUser();
//     return userRes;
//   };

//   const currentPath = useLocation();
//   const isStopWatch = currentPath.pathname === '/stop-watch';

//   const [bottomTictocExecuted, setBottomTictocExecuted] = useState(false); // 상태 추가

//   useEffect(() => {
//     if (isStopWatch && !bottomTictocExecuted) {
//       // /stop-watch 페이지에 진입하고 함수가 아직 실행되지 않았을 때 실행
//       // 여기에 실행하고자 하는 함수를 호출할 수 있습니다.
//       // 예를 들어, 아래와 같이 실행합니다.
//       // executeBottomTictocFunction();
//       timepause()
//       // 함수 실행 후 상태를 변경하여 다시 실행하지 않도록 합니다.
//       setBottomTictocExecuted(true);
//     }

//     // 나머지 코드
//     fetchUser();
//   }, [currentPath, isStopWatch, bottomTictocExecuted]);

//   return (
//     <>
//       <Navbar NavbarContent={NavbarContent} />
//       <Outlet />
//       {!isStopWatch && <BottomTictoc />}
//     </>
//   );
// }
