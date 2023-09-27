import { useEffect, useRef } from "react";
import { useShowModal } from "./useShowModal";
import type { scheduleSetter } from "../DateBox";
import "./schedule.css";
import Comment from "../../Comment";

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
      <section className="eventWindow">
        <header className="eventWindow-header">
          <h1
            suppressContentEditableWarning={true}
            ref={focusRef}
            contentEditable={true}
            placeholder={"제목없음"}
          ></h1>
          <div className="eventWindow-date">
            <p>📆 날짜: {makeScheduleDate()}</p>
          </div>
        </header>
        <div className="eventWindow-contents">
          {content ? <Comment /> : null}
        </div>
        <footer className="eventWindow-footer"></footer>
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
      className="modal"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <ModalContent />
    </div>
  );
}
