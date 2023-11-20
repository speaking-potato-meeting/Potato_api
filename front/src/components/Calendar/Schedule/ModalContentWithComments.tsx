import { useEffect, useRef, useState } from "react";
import Comment from "../../Comment";

import { useModalContext } from "../../../context/ModalProvider";
import { useShowModal } from "./useShowModal";
import { useCurrentUserContext } from "../../../context/CurrentUserContextProvider";

import type { ModalProps } from "../Schedule/Modal";
import type { scheduleSetter } from "../../../hooks/useSchedule";

interface UserModalProps extends ModalProps {
  id: number;
}

interface AdminModalProps extends ModalProps {
  scheduleSetter: scheduleSetter;
}

type ModalWithCommentsProps = UserModalProps | AdminModalProps;

/* prop을 기준으로 일반 유저/관리자용 Modal을 체크합니다. */
function ModalContentWithComments(props: ModalWithCommentsProps) {
  const focusRef = useRef<HTMLHeadingElement>(null!);

  const [isHoliday, setIsHoliday] = useState(props.is_holiday);

  const userInfo = useCurrentUserContext();

  const modalContext = useModalContext();

  const { onClose } = useShowModal();

  useEffect(() => {
    focusRef.current.focus();
  }, []);
  
  // props.is_holiday 값이 변경될 때마다 useEffect가 실행.. 체크박스의 초기값이 제대로 설정되겠지?
  useEffect(() => {
    console.log("props:", props);
    console.log("is_holiday: ", props.is_holiday)
    setIsHoliday(props.is_holiday);
  }, [props.is_holiday]);
  
  
  useEffect(() => {
    if (modalContext?.close !== "ModalClose") return;

    if (modalContext?.close && props.scheduleSetter) {
      const { add, edit } = props.scheduleSetter;

      if (add || (!props.id && add)) {
        add(props.date, focusRef.current.textContent ?? "제목없음", isHoliday);
        return onClose(null);
      }

      if (edit && props.id) {
        /* 이전과 같은 값이면 요청을 보내지 않습니다. */
        if (focusRef.current.textContent === props.content && isHoliday === props.is_holiday)
          return onClose(null);
        edit(props.id, props.date, focusRef.current.textContent ?? "제목없음", isHoliday);
      }
    }
    return onClose(null);
  }, [modalContext]);

  /* Admin타입 가드 함수입니다. */
  function isAdmin(props: ModalWithCommentsProps): props is AdminModalProps {
    return (props as AdminModalProps).scheduleSetter !== undefined;
  }

  function makeScheduleDate(): string | null {
    const inModalDay = Date.parse(props.date);
    if (inModalDay) {
      const scheduleDate = new Date(inModalDay);
      return `${scheduleDate.getFullYear()}년 ${
        scheduleDate.getMonth() + 1
      }월 ${scheduleDate.getDate()}일`;
    }

    return null;
  }

  const handleRemove = () => {
    if (isAdmin(props) && props.id) {
      props.scheduleSetter.delete?.(props.id);
    }
    return onClose(null);
  };

  return (
    <section className="eventWindow">
      <header className="eventWindow-header">
        <div className="eventWindow-isholiday">
          <input 
            type="checkbox" 
            className="eventWindow-checkbox" 
            id="is_holiday" 
            contentEditable={userInfo?.is_staff}
            checked={props.is_holiday}
            onChange={e => setIsHoliday(e.target.checked)}
          />
          {/* <label htmlFor="is_holiday">휴일인가요?</label> */}
          <span>휴일인가요?</span>
        </div>
        <h1
          suppressContentEditableWarning={true}
          ref={focusRef}
          contentEditable={userInfo?.is_staff}
          placeholder={"제목없음"}
        >
          {props.content ? props.content : null}
        </h1>
        <div className="eventWindow-date">
          <p>📆 날짜: {makeScheduleDate()}</p>
        </div>
      </header>
      <div className="eventWindow-contents">
        <Comment />
      </div>
      <footer className="eventWindow-footer">
        {userInfo?.is_staff && (
          <button className="eventWindow-delete-btn" onClick={handleRemove}>
            <span>삭제하기</span>
          </button>
        )}
      </footer>
    </section>
  );
}

export default ModalContentWithComments;
