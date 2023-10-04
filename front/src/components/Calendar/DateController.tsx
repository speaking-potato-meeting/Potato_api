interface Props {
  onClick: (change: number) => void;
  buttonText: string;
}

export default function DateController({ onClick, buttonText }: Props) {
  return (
    <div className={"buttonGroup"}>
      <button onClick={() => onClick(-1)}>&lt;</button>
      <button onClick={() => onClick(0)}>{buttonText}</button>
      <button onClick={() => onClick(1)}> &gt;</button>
    </div>
  );
}
