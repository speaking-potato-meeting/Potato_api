import { ISchedule } from "../../../api/schedule";
import { useDraggable } from "@dnd-kit/core";
import { useShowModal } from "./useShowModal";
import type { scheduleSetter } from "../DateBox";

interface Props {
  day: Date;
  schedule: ISchedule[];
  scheduleSetter: scheduleSetter;
}

export default function Schedule({ schedule, day, scheduleSetter }: Props) {
  return (
    <ul className="schedule">
      {schedule.map((s) => (
        <li key={s.id}>
          <ScheduleItem
            content={s.schedule}
            date={day}
            id={`${s.id}+${day.toString()}`}
            scheduleSetter={scheduleSetter}
          />
        </li>
      ))}
    </ul>
  );
}

function ScheduleItem({
  id,
  scheduleSetter,
  date,
  content,
}: {
  id: string;
  date: Date;
  scheduleSetter?: scheduleSetter;
  content: string;
}) {
  const { onShow } = useShowModal();
  const { setNodeRef, listeners, transform } = useDraggable({
    id: id,
  });

  const handleShow = () => {
    onShow({
      props: {
        content,
        date,
        scheduleSetter,
        id: parseInt(id.split("+")[0]),
      },
    });
  };

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <button
      className="schedule-modal-btn"
      ref={setNodeRef}
      {...listeners}
      style={style}
      onClick={handleShow}
      // document.body.style.overflow = "hidden";
    >
      <p className="schedule-content"> {content}</p>
    </button>
  );
}
