import { Outlet, useNavigate } from "react-router-dom";
import { getCurrentUserInfo } from "../../api/login";
import { useState, useEffect } from "react";

export default function Account() {
  const [logined, setLogined] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = async () => {
    const getUserRes = await getCurrentUserInfo();

    if (getUserRes !== null) {
      setLogined(true);
      return;
    }
    setLogined(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  if (logined)
    return (
      <div className="wrapper">
        <div>로그인한 사용자입니다.</div>
        <button onClick={() => navigate("/")}>홈으로</button>
      </div>
    );

  if (logined === null) return <>정보를 불러오고 있습니다.</>;

  return (
    <>
      <Outlet />
    </>
  );
}
