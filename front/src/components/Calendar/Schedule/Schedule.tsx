import { ISchedule } from "../../../api/schedule";
import { useDraggable } from "@dnd-kit/core";
import { useShowModal } from "./useShowModal";
import { useScheduleDispatchContext } from "../../../context/ScheduleProvider";
import { useCurrentUserContext } from "../../../context/CurrentUserContextProvider";

interface Props {
  day: string;
  schedule: ISchedule[];
}

export default function Schedule({ schedule, day }: Props) {
  return (
    <ul className="schedule">
      {schedule.map((s) => (
        <li key={s.id}>
          <ScheduleItem content={s.schedule} date={day} id={`${s.id}+${day}`} />
        </li>
      ))}
    </ul>
  );
}

function ScheduleItem({
  id,
  date,
  content,
}: {
  id: string;
  date: Date;
  content: string;
}) {
  const userInfo = useCurrentUserContext();
  const dispatch = useScheduleDispatchContext();
  const { onShow } = useShowModal();
  const { setNodeRef, listeners, transform } = useDraggable({
    id: id,
  });

  const handleShow = () => {
    onShow({
      props: {
        content,
        date,
        id: parseInt(id.split("+")[0]),
        scheduleSetter: userInfo?.is_staff
          ? { edit: dispatch?.edit, delete: dispatch?.delete }
          : undefined,
      },
    });
  };

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <>
      {userInfo?.is_staff ? (
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
      ) : (
        <button className="schedule-modal-btn" onClick={handleShow}>
          <p className="schedule-content">{content}</p>
        </button>
      )}
    </>
  );
}
