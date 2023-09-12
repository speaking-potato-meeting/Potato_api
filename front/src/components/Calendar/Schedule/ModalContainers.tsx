import { useContext } from "react";
import { ModalStateContext } from "../../../context/ModalProvider";
import Modal from "./Modal";
import { createPortal } from "react-dom";

export default function ModalContainer() {
  const state = useContext(ModalStateContext);

  if (!state) return null;

  const ModalProps = state.props;

  return createPortal(<Modal {...ModalProps} />, document.body);
}
