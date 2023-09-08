import { useState } from "react";

export function useShowModal() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const onShow = () => setShowModal(true);
  const onClose = () => {
    console.log("이거 실행되고 있는데");
    setShowModal(false);
  };

  return { showModal, onShow, onClose };
}
