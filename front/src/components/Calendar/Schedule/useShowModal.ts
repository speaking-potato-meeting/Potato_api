import { useContext } from "react";
import { ModalSetterContext } from "../../../context/ModalProvider";
import { state } from "../../../context/ModalProvider";

export function useShowModal() {
  const setModalState = useContext(ModalSetterContext);

  const onShow = (props: state) => {
    setModalState(props);
  };
  const onClose = (args: "ModalClose" | null) => {
    if (args === "ModalClose")
      return setModalState((prev) => {
        return { ...prev, close: args };
      });

    return setModalState(null);
  };

  return { onShow, onClose };
}
