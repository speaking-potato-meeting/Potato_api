import { useEffect, useRef } from "react";
import { contents } from "../Calendar";
type ModalProps = {
  onClose: () => void;
  contents?: contents[];
};

export default function Modal({ onClose, contents }: ModalProps) {
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
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: "0",
        backgroundColor: "#22222231",
        display: "flex",
        alignItems: "center",
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
        {contents?.map((c) => (
          <p key={c.id}>{c.content}</p>
        ))}
      </div>
    </div>
  );
}
