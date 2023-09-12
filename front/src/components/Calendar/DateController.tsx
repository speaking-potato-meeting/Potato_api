interface Props {
  onClick: (change: number) => void;
}

export default function DateController({ onClick }: Props) {
  return (
    <div className={"buttonGroup"}>
      <button onClick={() => onClick(-1)}>&lt;</button>
      <button onClick={() => onClick(0)}>오늘</button>
      <button onClick={() => onClick(1)}> &gt;</button>
    </div>
  );
}
