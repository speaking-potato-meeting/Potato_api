import { useEffect, useRef } from "react";
import { useShowModal } from "./useShowModal";
import "./schedule.css";
import ModalContentWithComments from "./ModalContentWithComments";
import { scheduleSetter } from "../../../hooks/useSchedule";

export interface ModalProps {
  id?: number;
  date: string;
  content: string;
  is_holiday: boolean;
  scheduleSetter?: scheduleSetter;
}

export default function Modal(props: ModalProps) {
  const { onClose } = useShowModal();

  const scrollRef = useRef<number>(0);

  useEffect(() => {
    scrollRef.current = window.scrollY;

    const preventScroll = () => {
      window.scrollTo(0, scrollRef.current);
    };

    window.addEventListener("scroll", preventScroll, { passive: false });
    return () => {
      window.removeEventListener("scroll", preventScroll);
    };
  }, []);

  const closeModal = () => {
    onClose("ModalClose");
  };

  const ModalContent = () => {
    return <ModalContentWithComments {...props} />;
  };

  return (
    <div
      className="modal"
      onMouseDown={(e) => {
        e.target === e.currentTarget && closeModal();
      }}
    >
      {ModalContent()}
    </div>
  );
}
