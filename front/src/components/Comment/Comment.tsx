import "./Comment.css";
import { useState, useEffect, useRef, FormEvent } from "react";
import { CommentResponseType, CommentType, CommentProps } from "../../types";
import axios from "axios";
import { useCurrentUserContext } from "../../context/CurrentUserContextProvider";
import { BASE_URL } from "../../api/signup";

// 한국 시간으로 포매팅된 오늘 날짜
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const formattedToday = `${year}-${month}-${day}`;


const Comment = ({ date: externalDate }: CommentProps): JSX.Element => {
  /* 로그인하지 않은 유저인지 확인 */
  const userInfo = useCurrentUserContext();

  const [newText, setNewText] = useState("");
  const [newEditText, setNewEditText] = useState("");
  // 댓글 담기는 곳
  const [comments, setComments] = useState<CommentType[]>([]);

  // 댓글 fetch로 받아오는 오늘 스케줄 ID
  const [todayScheduleId, setTodayScheduleId] = useState<number | null>(null);
  // 수정 기능을 위해 대상 댓글의 ID 받아오는..
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // 댓글 내용 포커싱을 위한 useRef
  const CommentTextInput = useRef<HTMLInputElement>(null);
  const CommentEditTextInput = useRef<HTMLTextAreaElement>(null);

  // 수정 모드 때 사용될 오류 메세지
  const [commentEditErrorMessage, setCommentEditErrorMessage] = useState("");


  // 데이터를 서버에서 가져오는 함수
  const fetchData = async () => {
    let scheduleId; // scheduleId 변수를 try 블록 외부에서 선언

    try {
      const today_schedule_id_response = await axios.get(
        `${BASE_URL}/api/schedule/schedules/`,
        { 
          // 특정일자 조회로 첫날 마지막날을 오늘로 맞춘 다음에 조회해서 id 가지고 오면 될거같음!
          params: {
            from_date: externalDate ?? formattedToday,
            to_date: externalDate ?? formattedToday,
          }
        }
      );
      scheduleId = today_schedule_id_response.data.filter((item: { category: string; }) => item.category === '출석')[0].id;
      setTodayScheduleId(scheduleId);
      console.log(todayScheduleId)
    } catch (error) {
      console.error("댓글 아이디를 가져오는 중 오류 발생:", error);
    }

    // 해당 스케줄의 comment들 정보 불러오기
    try {
      const response = await axios.get(
        `${BASE_URL}/api/schedule/schedules/${scheduleId}/comments`,
        { withCredentials: true }
      );
      const commentData = response.data;
      setComments(commentData)
    } catch (error) {
      // 없으면 없는대로 error 안띄워주기로..
    }
  };

  useEffect(() => {
    fetchData();
  }, [todayScheduleId]);

  // 댓글 생성시 submit
  const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막음
    createCommentSubmit(todayScheduleId);
  };

  // 댓글 생성 로직
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
      return;
    } else {
      try {
        const response: CommentResponseType = await axios.post(
          `${BASE_URL}/api/schedule/schedules/${schedule_id}/comments`, 
          {
            schedule_id: schedule_id,
            text: newText,
          },
          { withCredentials: true }
        );
  
        const newComment = {
          id: response.data.comment.id,
          schedule_id: response.data.comment.schedule_id,
          timestamp: response.data.comment.timestamp,
          text: response.data.comment.text,
          user_info: {
            user_id: response.data.user_info.user_id,
            username: response.data.user_info.username,
            profile_image: response.data.user_info.profile_image,
          },
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
      setCommentEditErrorMessage('');
    } else {
      // 수정 중이 아니면 해당 댓글을 수정 모드로 변경
      setEditingCommentId(id);
      setNewEditText(text);
      setCommentEditErrorMessage('');
    }
  };

  // 댓글 수정시 실행함수
  const handleConfirmEdit = (id: number) => {
    if (newEditText.length === 0 || editingCommentId === null) {
      // 댓글 내용이 비어있거나 수정 대상 댓글이 없으면 수정하지 않음
      if (CommentEditTextInput.current) {
        CommentEditTextInput.current.focus();
        setCommentEditErrorMessage('내용을 입력해주세요')
      }
      return;
    }
    // 수정된 내용을 백엔드로 전송하고 상태를 업데이트
    editComment(id, newEditText);
    setCommentEditErrorMessage('');
  };

  // 댓글 수정
  const editComment = async (id: number, text: string) => {
    if (text.length === 0 || id === null) {
      // 댓글 내용이 비어있거나 수정 대상 댓글이 없으면 수정하지 않음
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/schedule/comments/${id}`,
        {
          schedule_id: id,
          text: newEditText,
        },
        { withCredentials: true }
      );

      const updatedComments = comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            text: response.data.comment.text
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

  // 댓글 삭제
  const deleteCommentSubmit = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/schedule/comments/${id}`,
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
    <>
      {todayScheduleId === null ? (
        <p style={{textAlign: 'center'}}>오늘은 스터디 휴일입니다 ~ ✌️</p>
      ) : (
        <div className="comment">
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <div className="comment-profile-timestamp-box">
                  <div className="comment-profile-box">
                    <img
                      className="comment-pf-pic"
                      // back/profile_images/230611_0.jpeg 상대경로
                      // /Users/senga/Desktop/Potato_api/back/profile_images/230611_0.jpeg  절대경로
                      // src={userInfo?.first_name ? `${BASE_URL}${comment.user_info.profile_image}` : 'https://dummyimage.com/500x500/000/fff&text=.'}
                      src={'https://dummyimage.com/500x500/000/fff&text=.'} // s3 들어가면 경로가 바뀔 예정이라 더이상 진행하지 않고 임시로 더미 이미지 넣어둠
                      alt="프로필 사진"
                    />
                    <p className="comment-name">
                      {userInfo?.first_name ? `${comment.user_info.username}` : "이름을 불러올 수 없습니다."}
                    </p>
                  </div>
                  <div>
                    <p>{elapsedTime(comment.timestamp)}</p>
                  </div>
                </div>

                <div className="comment-edit-content">
                  {/*  수정 모드 일때 */}
                  {editingCommentId === comment.id ? (
                    <div className="comment-edit-form-box">
                      <span className='comment-edit-invalid-span'>{commentEditErrorMessage}</span>
                      <textarea 
                        ref={CommentEditTextInput}
                        className="comment-edit-input"
                        placeholder="댓글을 입력하세요"
                        value={newEditText}
                        onChange={(e) => setNewEditText(e.target.value)}
                        cols={51}
                        rows={2}
                      />
                    </div>
                  ) : (
                    // 수정 모드 아닐 때
                    <p className="comment-text">{comment.text}</p>
                  )}
                  <div className="comment-btn-container">
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
                        {editingCommentId === comment.id ? (
                          <button
                            className="comment-btn"
                            onClick={() => handleConfirmEdit(comment.id)}
                          >
                            확인
                          </button>
                        ) : <></>}
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
            <form onSubmit={handleCommentSubmit}>
              <input
                ref={CommentTextInput}
                className="comment-input"
                type="text"
                placeholder="댓글을 입력하세요"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <button type="submit">댓글 생성</button>
            </form>
          ) : (
            <p>로그인이 필요합니다.</p>
          )}
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
