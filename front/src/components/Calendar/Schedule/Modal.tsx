import { useEffect, useRef } from "react";
import { useShowModal } from "./useShowModal";
import type { scheduleSetter } from "../DateBox";
import "./schedule.css";
import Comment from "../../Comment";

export interface ModalProps {
  id?: number;
  date: string;
  scheduleSetter?: scheduleSetter;
  content: string;
}

export default function Modal({
  id,
  date,
  scheduleSetter,
  content,
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
    const inModalDay = Date.parse(date);
    if (inModalDay) {
      const scheduleDate = new Date(inModalDay);
      return `${scheduleDate.getFullYear()}년 ${
        scheduleDate.getMonth() + 1
      }월 ${scheduleDate.getDate()}일`;
    }

    return null;
  }

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

  const ModalContent = () => {
    return (
      <section className="eventWindow">
        <header className="eventWindow-header">
          <h1
            suppressContentEditableWarning={true}
            ref={focusRef}
            contentEditable={true}
            placeholder={"제목없음"}
          >
            {content ? content : null}
          </h1>
          <div className="eventWindow-date">
            <p>📆 날짜: {makeScheduleDate()}</p>
          </div>
        </header>
        <div className="eventWindow-contents">
          <Comment />
        </div>
        <footer className="eventWindow-footer"></footer>
      </section>
    );
  };

  return (
    <div
      className="modal"
      onMouseDown={(e) => {
        e.target === e.currentTarget && closeModal();
      }}
    >
      <ModalContent />
    </div>
  );
}
