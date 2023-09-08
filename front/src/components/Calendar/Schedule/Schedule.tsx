import { ISchedule } from "../Calendar";
import "./style.css";
import { useDraggable } from "@dnd-kit/core";

interface Props {
  day: Date;
  schedule: ISchedule;
}

export default function Schedule({ schedule, day }: Props) {
  const { contents } = schedule;

  return (
    <ul className="schedule">
      {contents.map((c) => (
        <li key={c.id}>
          <ScheduleItem content={c.content} id={`${c.id}+${day.toString()}`} />
        </li>
      ))}
    </ul>
  );
}

function ScheduleItem({ id, content }: { id: string; content: string }) {
  const { setNodeRef, listeners, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      style={style}
      // document.body.style.overflow = "hidden";
    >
      <div className="schedule__content">{content}</div>
    </button>
  );
}
