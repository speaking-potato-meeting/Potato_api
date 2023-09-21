// Comment.tsx
import { useState, useEffect, useRef } from 'react';
import { commentType } from "../types";
import './comment.css'
import axios from 'axios';

const dateNow = new Date();
const today = dateNow.toISOString().slice(0, 10);

const Comment = (): JSX.Element => {
  // text를 받아오는 고런..
  const [newText, setNewText] = useState('');
  const [newEditText, setNewEditText] = useState('');
  // 댓글 생성시..
  const [comments, setComments] = useState<commentType[]>([]);
  // 수정 기능을 위해 대상 댓글의 ID 받아오는..
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  // 댓글 내용 포커싱을 위한 useRef
  const CommentTextInput: React.MutableRefObject< | HTMLInputElement | undefined> = useRef();
  const CommentEditTextInput: React.MutableRefObject< | HTMLInputElement | undefined> = useRef();


  // 데이터를 서버에서 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/comments/'); // 백엔드의 API 엔드포인트를 설정하세요
      const commentData = response.data;
      setComments(commentData);
    } catch (error) {
      console.error('댓글 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 기존 비동기 코드 대체
  useEffect(() => {
    fetchData();
  }, []);

  
  const createCommentSubmit = async () => {
    // 유효성 검사 (댓글 내용 비어있는지)
    if (newText.length === 0) {
      if (CommentTextInput.current) {
        CommentTextInput.current.focus();
      }     
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/comments', {
        user_id: 2, // user 어떻게 넘겨줘야하지? 임시로 이렇게 넘겨주기
        text: newText, // 새로 받을 텍스트
      });

      const newComment = {
        id: response.data.id,
        user_id: 2, // 여기도 임시로...
        timestamp: response.data.timestamp,
        text: newText,
      };
      
      // 새로운 댓글을 기존 댓글 목록에 추가
      setComments([...comments, newComment]);
      setNewText('');
    } catch (error) {
      console.error('댓글 생성 중 오류 발생:', error);
    }
  };

  // 수정버튼을 누를 때 호출되는 함수
  const editCommentSubmit = (id: number, text: string) => {
    if (editingCommentId === id) {
      // 이미 수정 중인 상태면 수정을 취소하고 읽기 모드로 변경
      setEditingCommentId(null);
      setNewEditText('');
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
      const response = await axios.put(`http://127.0.0.1:8000/api/comments/${id}`, {
        user_id: 2,
        text: newEditText,
        timestamp: new Date().toISOString().slice(0, 10)
      });
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
      setNewEditText('');
      setEditingCommentId(null);
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const deleteCommentSubmit = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/comments/${id}`); // 추가됨
      const updatedComments = comments.filter((comment) => comment.id !== id);
      setComments(updatedComments);
    } catch (error) {
      console.error('에러 발생 : ', error);
    }    
  };

  // '~분 전'으로 표시되는 함수
  const elapsedTime = (date: Date): string => {
    const start = new Date(date);
    const end = new Date();

    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (seconds < 60) return '방금 전';

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}분 전`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}시간 전`;

    const days = hours / 24;
    if (days < 7) return `${Math.floor(days)}일 전`;

    return `${start.toLocaleDateString()}`;
  };

  return (
    <div className='comment'>
      <h1 className='today'>{today}</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <div className='comment-profile-timestamp-box'>
              <div className='comment-profile-box'>
                <img className='comment-pf-pic' src='../images/yang.jpeg' alt="프로필 사진" />
                {/* 일단 user 말고 comment.id로 하겠음 */}
                <p className='comment-name'>{comment.id}</p>
              </div>
              <div>
                <p>{elapsedTime(comment.timestamp)}</p>
              </div>
            </div>


            <div className='comment-edit-content'>
              {/*  수정 모드 일때 */}
              {editingCommentId === comment.id ? (
                <div>
                  <input
                    ref={CommentEditTextInput as React.MutableRefObject<HTMLInputElement>}
                    className='comment-edit-input'
                    type='text'
                    placeholder="댓글을 입력하세요"
                    value={newEditText}
                    onChange={(e) => setNewEditText(e.target.value)}
                  />
                </div>
              ) : ( 
                // 수정 모드 아닐 때
                <div>
                  <p className='comment-text'>{comment.text}</p>
                </div>
              )}
              <div className='comment-btn-container'>
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
                <button className='comment-btn' onClick={() => editCommentSubmit(comment.id, comment.text)}>
                  {editingCommentId === comment.id ? "취소" : "수정"}
                </button>
                <button className='comment-btn' onClick={() => handleConfirmEdit(comment.id)}>
                  확인
                </button>
                <button className='comment-btn' onClick={() => deleteCommentSubmit(comment.id)}>삭제</button>
              </div>
            </div>


          </li>
        ))}
      </ul>
      <div className='comment-input-box'>
        <input
          ref={CommentTextInput as React.MutableRefObject<HTMLInputElement>}
          className='comment-input'
          type='text'
          placeholder="댓글을 입력하세요"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button onClick={createCommentSubmit}>
          댓글 생성
        </button>
      </div>
    </div>
  );
};

export default Comment;
