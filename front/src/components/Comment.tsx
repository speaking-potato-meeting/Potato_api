// Comment.tsx
import { useState, useEffect, useRef } from "react";
import { commentType } from "../types";
import "./comment.css";
import axios from "axios";
import { useCurrentUserContext } from "../context/CurrentUserContextProvider";

// 한국 시간으로 포매팅된 오늘 날짜
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedToday = `${year}-${month}-${day}`;

const Comment = (): JSX.Element => {
  /* 로그인하지 않은 유저인지 확인 */
  const userInfo = useCurrentUserContext();

  // text를 받아오는 고런..
  const [newText, setNewText] = useState("");
  const [newEditText, setNewEditText] = useState("");
  // 댓글 생성시..
  const [comments, setComments] = useState<commentType[]>([]);
  // 수정 기능을 위해 대상 댓글의 ID 받아오는..
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  // 댓글 내용 포커싱을 위한 useRef
  const CommentTextInput: React.MutableRefObject<HTMLInputElement | undefined> =
    useRef();
  const CommentEditTextInput: React.MutableRefObject<
    HTMLInputElement | undefined
  > = useRef();
  const [todayScheduleId, setTodayScheduleId] = useState<number | null>(null);


  // 데이터를 서버에서 가져오는 함수
  const fetchData = async () => {
    try {
      const today_schedule_id_response = await axios.get(
        `http://127.0.0.1:8000/api/schedule/schedules/`,
        { 
          // 특정일자 조회로 첫날 마지막날을 오늘로 맞춘 다음에 조회해서 id 가지고 오면 될거같음!
          params: {
            from_date: formattedToday,
            to_date: formattedToday,
            // 현재 category는 생성이 안되어있으니 그거는 일단 제외하고 작업함
            // category : '출석부'
          }
        }
      );
      const scheduleId = today_schedule_id_response.data[0].id;
      setTodayScheduleId(scheduleId);

      /* 백엔드의 API 엔드포인트를 설정하세요(/api/schedule/schedules/{schedule_id}/comments/) */
      const response = await axios.get(
        `http://127.0.0.1:8000/api/schedule/schedules/${scheduleId}/comments/`,
        { withCredentials: true }
      );
      const commentData = response.data;
      setComments(commentData);
    } catch (error) {
      console.error("댓글 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 기존 비동기 코드 대체
  useEffect(() => {
    fetchData();
  }, []);

  const createCommentSubmit = async (schedule_id: number | null) => {
    // 유효성 검사 (댓글 내용 비어있는지)
    if (newText.length === 0) {
      if (CommentTextInput.current) {
        CommentTextInput.current.focus();
      }
      return;
    }

    if (schedule_id === null) {
      console.log('schedule_id를 찾을 수 없습니다.');
    } else {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/schedule/schedules/${schedule_id}/comments`, 
          {
            schedule_id: schedule_id,
            text: newText,
          },
          { withCredentials: true }
        );
  
        const newComment = {
          id: response.data.id,
          user_id: response.data.user_id,
          schedule_id: response.data.schedule_id,
          timestamp: response.data.timestamp,
          text: response.data.text,
        };
  
        // 새로운 댓글을 기존 댓글 목록에 추가
        setComments([...comments, newComment]);
        setNewText("");
      } catch (error) {
        console.error("댓글 생성 중 오류 발생:", error);
      }
    }
  };

  // 수정버튼을 누를 때 호출되는 함수
  const editCommentSubmit = (id: number, text: string) => {
    if (editingCommentId === id) {
      // 이미 수정 중인 상태면 수정을 취소하고 읽기 모드로 변경
      setEditingCommentId(null);
      setNewEditText("");
    } else {
      // 수정 중이 아니면 해당 댓글을 수정 모드로 변경
      setEditingCommentId(id);
      setNewEditText(text);
    }
  };

  // 댓글 수정시 실행함수
  const handleConfirmEdit = (id: number) => {
    if (newEditText.length === 0 || editingCommentId === null) {
      // 댓글 내용이 비어있거나 수정 대상 댓글이 없으면 수정하지 않음
      return;
    }
    // 수정된 내용을 백엔드로 전송하고 상태를 업데이트
    updateComment(id, newEditText);
  };

  // 댓글 수정 함수
  const updateComment = async (id: number, text: string) => {
    if (text.length === 0 || id === null) {
      // 댓글 내용이 비어있거나 수정 대상 댓글이 없으면 수정하지 않음
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/schedule/comments/${id}`,
        {
          user_id: 2,
          text: newEditText,
          timestamp: new Date().toISOString().slice(0, 10),
        },
        { withCredentials: true }
      );
      const updatedComments = comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            text: response.data.text,
            timestamp: new Date(),
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setNewEditText("");
      setEditingCommentId(null);
    } catch (error) {
      console.error("댓글 수정 중 오류 발생:", error);
    }
  };

  const deleteCommentSubmit = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/schedule/comments/${id}`,
      { withCredentials: true });
      const updatedComments = comments.filter((comment) => comment.id !== id);
      setComments(updatedComments);
    } catch (error) {
      console.error("에러 발생 : ", error);
    }
  };

  // '~분 전'으로 표시되는 함수
  const elapsedTime = (date: Date): string => {
    const start = new Date(date);
    const end = new Date();

    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return "방금 전";

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;

    return `${start.toLocaleDateString()}`;
  };

  return (
    <div className="comment">
      <h1 className="today">{formattedToday}</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className="comment-profile-timestamp-box">
              <div className="comment-profile-box">
                <img
                  className="comment-pf-pic"
                  src="../images/yang.jpeg"
                  alt="프로필 사진"
                />
                <p className="comment-name">
                  {userInfo?.first_name ?? "이름을 불러올 수 없습니다."}
                </p>
              </div>
              <div>
                <p>{elapsedTime(comment.timestamp)}</p>
              </div>
            </div>

            <div className="comment-edit-content">
              {/*  수정 모드 일때 */}
              {editingCommentId === comment.id ? (
                <div>
                  <input
                    ref={
                      CommentEditTextInput as React.MutableRefObject<HTMLInputElement>
                    }
                    className="comment-edit-input"
                    type="text"
                    placeholder="댓글을 입력하세요"
                    value={newEditText}
                    onChange={(e) => setNewEditText(e.target.value)}
                  />
                </div>
              ) : (
                // 수정 모드 아닐 때
                <div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              )}
              <div className="comment-btn-container">
                {/* {editingCommentId === comment.id ? (
                  // 수정 모드 일때
                  <div>
                    <button onClick={handleConfirmEdit}>확인</button>
                    <button onClick={() => setEditingCommentId(null)}>취소</button>
                    <button onClick={() => deleteCommentSubmit(comment.id)}>삭제</button>
                  </div>
                ) : ( 
                  // 수정 모드 아닐 때
                  <div>
                    <button onClick={() => editCommentSubmit(comment.id, comment.text)}>수정</button>
                    <button onClick={() => deleteCommentSubmit(comment.id)}>삭제</button>
                  </div>
                )} */}
                {userInfo && (
                  <>
                    <button
                      className="comment-btn"
                      onClick={() =>
                        editCommentSubmit(comment.id, comment.text)
                      }
                    >
                      {editingCommentId === comment.id ? "취소" : "수정"}
                    </button>
                    <button
                      className="comment-btn"
                      onClick={() => handleConfirmEdit(comment.id)}
                    >
                      확인
                    </button>
                    <button
                      className="comment-btn"
                      onClick={() => deleteCommentSubmit(comment.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="comment-input-box">
        {userInfo ? (
          <>
            <input
              ref={CommentTextInput as React.MutableRefObject<HTMLInputElement>}
              className="comment-input"
              type="text"
              placeholder="댓글을 입력하세요"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            <button onClick={() => createCommentSubmit(todayScheduleId)}>댓글 생성</button>
          </>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
