import { useContext } from "react";
import { ModalSetterContext } from "../../../context/ModalProvider";
import { state } from "../../../context/ModalProvider";

export function useShowModal() {
  const setModalState = useContext(ModalSetterContext);

  const onShow = (props: state) => {
    setModalState(props);
  };
  const onClose = () => {
    setModalState(null);
  };

  return { onShow, onClose };
}
