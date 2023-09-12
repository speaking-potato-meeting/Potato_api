import { useEffect, useRef } from "react";
import { useShowModal } from "./useShowModal";
import type { scheduleSetter } from "../DateBox";

export interface ModalProps {
  id?: number;
  date: string;
  content: string;
  scheduleSetter?: scheduleSetter;
}

export default function Modal({
  id,
  date,
  content,
  scheduleSetter,
}: ModalProps) {
  const { onClose } = useShowModal();
  const scrollRef = useRef<number>(0);
  const focusRef = useRef<HTMLHeadingElement>(null!);

  useEffect(() => {
    scrollRef.current = window.scrollY;
    focusRef.current.focus();

    const preventScroll = () => {
      window.scrollTo(0, scrollRef.current);
    };

    window.addEventListener("scroll", preventScroll, { passive: false });
    return () => {
      window.removeEventListener("scroll", preventScroll);
    };
  }, []);

  function makeScheduleDate(): string | null {
    if (date) {
      const scheduleDate = new Date(Date.parse(date));
      return `${scheduleDate.getFullYear()}년 ${
        scheduleDate.getMonth() + 1
      }월 ${scheduleDate.getDate()}일`;
    }

    return null;
  }

  const ModalContent = () => {
    return (
      <section
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        <h1
          suppressContentEditableWarning={true}
          ref={focusRef}
          contentEditable={true}
          placeholder={"제목없음"}
          style={{ outline: "none" }}
        >
          {content ? content : null}
        </h1>
        <div>📆 날짜: {makeScheduleDate()}</div>
      </section>
    );
  };

  const closeModal = () => {
    if ("addNewSchedule" in scheduleSetter) {
      const { addNewSchedule } = scheduleSetter;
      if (focusRef.current.textContent && addNewSchedule) {
        addNewSchedule(date, focusRef.current.textContent);
      }
    }

    if ("editSchedule" in scheduleSetter) {
      const { editSchedule } = scheduleSetter;
      if (focusRef.current.textContent && editSchedule)
        if (typeof id === "number")
          editSchedule(id, date, focusRef.current.textContent);
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      style={{
        position: "fixed",
        inset: "0",
        backgroundColor: "#22222231",
        display: "flex",
        alignItems: "center",
        zIndex: "10",
      }}
    >
      <div
        style={{
          width: "50vw",
          height: "80vw",
          maxHeight: "800px",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "20px",
        }}
      >
        <ModalContent />
      </div>
    </div>
  );
}
