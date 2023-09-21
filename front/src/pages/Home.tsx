import { Outlet } from "react-router-dom";
import Calendar from "../components/Calendar/Calendar";
import ModalContainer from "../components/Calendar/Schedule/ModalContainers";
import Comment from "../components/Comment";
import ModalProvider from "../context/ModalProvider";

const Home = () => {
  return (
    <>
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
