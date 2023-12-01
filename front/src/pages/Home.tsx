import { Outlet } from "react-router-dom";
import Calendar from "../components/Calendar/Calendar";
import ModalContainer from "../components/Calendar/Schedule/ModalContainers";
import Comment from "../components/Comment/Comment.tsx";
import ModalProvider from "../context/ModalProvider";

const Home = () => {
  // 한국 시간으로 포매팅된 오늘 날짜
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedToday = `${year}-${month}-${day}`;

  return (
    <>
      <h1 className="today">{formattedToday}</h1>
      <Comment />
      <ModalProvider>
        <Calendar />
        <ModalContainer />
      </ModalProvider>
      <Outlet />
    </>
  );
};

export default Home;
