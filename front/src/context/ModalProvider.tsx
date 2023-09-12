import { createContext, useState } from "react";
import { ModalProps } from "../components/Calendar/Schedule/Modal";

export type state = {
  props: ModalProps;
} | null;

type setter = React.Dispatch<React.SetStateAction<state>>;

export const ModalStateContext = createContext<state>(null);
export const ModalSetterContext = createContext<setter>(() => {});

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<state>(null);

  return (
    <ModalSetterContext.Provider value={setState}>
      <ModalStateContext.Provider value={state}>
        {children}
      </ModalStateContext.Provider>
    </ModalSetterContext.Provider>
  );
}
