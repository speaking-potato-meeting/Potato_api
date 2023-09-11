// Comment.tsx
import { useState, useEffect, useRef } from 'react';
import { commentType } from "../types";
import './comment.css'

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

  useEffect(() => {
    // JSON 파일을 비동기적으로 로드
    fetch('/src/comments.json')
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => console.error('댓글 데이터를 로드하는 중 오류 발생:', error));
  }, []);

  const handleCommentSubmit = () => {
    if (newText.length === 0) {
      // 댓글 내용이 비어있으면 input창으로 포커싱하고 등록하지 않음
      if (CommentTextInput.current) {
        CommentTextInput.current.focus();
      }     
      return;
    }

    // text 제외한 모든 고정된 값을 가진 댓글을 생성
    const newComment = {
      id: comments.length,
      name: 'yangu1455',
      text: newText,
      timestamp: new Date(),
      pf_pic: "./images/킹감자.jpeg",
    };

    // 새로운 댓글을 기존 댓글 목록에 추가
    setComments([...comments, newComment]);
    setNewText('');
  };

  const editCommentSubmit = (id: number, text: string) => {
    setEditingCommentId(id);
    setNewEditText(text);
    // 안먹힘..
    // if (CommentEditTextInput.current) {
    //   CommentEditTextInput.current.focus();
    // }
  };

  const handleConfirmEdit = () => {
    if (newEditText.length === 0 || editingCommentId === null) {
      // 댓글 내용이 비어있거나 수정 대상 댓글이 없으면 수정하지 않음
      if (CommentEditTextInput.current) {
        CommentEditTextInput.current.focus();
      }
      return;
    }
  
    const updatedComments = comments.map((comment) => {
      if (comment.id === editingCommentId) {
        return {
          ...comment,
          // 새로 받을 text
          text: newEditText,
          // 수정된 시간
          timestamp: new Date(),
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setNewEditText('');
    setEditingCommentId(null);
  };

  const deleteCommentSubmit = (id: number) => {
    try {
      const updatedComments = comments.filter((comment) => comment.id !== id);
      setComments(updatedComments);
    } catch (error) {
      console.error('에러 발생 : ', error);
    }    
  };

  // 와 이거 '~분 전'으로 표시되는 함수 블로그에서 가지고 옴 감사합니다...
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
                <img className='comment-pf-pic' src={comment.pf_pic} alt="프로필 사진" />
                <p className='comment-name'>{comment.name}</p>
              </div>
              <div>
                <p>{elapsedTime(comment.timestamp)}</p>
              </div>
            </div>


            <div className='comment-edit-content'>
              {/* // 수정 모드 일때 */}
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
              <div>
                {editingCommentId === comment.id ? (
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
                )}
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
        <button onClick={handleCommentSubmit}>
          댓글 생성
        </button>
      </div>
    </div>
  );
};

export default Comment;
