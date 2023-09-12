import "./App.css";
import Calendar from "./components/Calendar/Calendar";
import ModalContainer from "./components/Calendar/Schedule/ModalContainers";
import ModalProvider from "./context/ModalProvider";

function App() {
  return (
    <>
      <ModalProvider>
        <Calendar />
        <ModalContainer />
      </ModalProvider>
    </>
  );
}

export default App;
