import { ISchedule } from "../Calendar";
import { useDraggable } from "@dnd-kit/core";
import { useShowModal } from "./useShowModal";
import type { scheduleSetter } from "../DateBox";

interface Props {
  day: Date;
  schedule: ISchedule;
  scheduleSetter: scheduleSetter;
}

export default function Schedule({ schedule, day, scheduleSetter }: Props) {
  const { contents, date } = schedule;

  return (
    <ul className="schedule">
      {contents.map((c) => (
        <li key={c.id}>
          <ScheduleItem
            content={c.content}
            id={`${c.id}+${day.toString()}`}
            date={date}
            scheduleSetter={scheduleSetter}
          />
        </li>
      ))}
    </ul>
  );
}

function ScheduleItem({
  id,
  content,
  date,
  scheduleSetter,
}: {
  id: string;
  content: string;
  date: ISchedule["date"];
  scheduleSetter: scheduleSetter;
}) {
  const { onShow } = useShowModal();
  const { setNodeRef, listeners, transform } = useDraggable({
    id: id,
  });

  const handleShow = () => {
    onShow({
      props: { date, content, scheduleSetter, id: parseInt(id.split("+")[0]) },
    });
  };

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      style={style}
      onClick={handleShow}
      // document.body.style.overflow = "hidden";
    >
      <div className="schedule__content">{content}</div>
    </button>
  );
}
