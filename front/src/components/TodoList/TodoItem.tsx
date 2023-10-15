import { useRef, useState } from 'react';
import { TodoItemProps } from '../../types';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiFillEdit } from 'react-icons/ai';
// 체크박스 아이콘
// import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.description);
  const [editErrorMessage, setEditErrorMessage] = useState("");

  const todoEditTextInput = useRef<HTMLInputElement>(null); // todoEditTextInput Ref 객체

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleUpdateClick = () => {
    if (editedContent.trim() !== '') {
      setEditErrorMessage("");
      onUpdate(todo.id, editedContent);
      setEditMode(false);
    } else {
      setEditErrorMessage("내용을 입력해주세요!");
      if (todoEditTextInput.current) {
        todoEditTextInput.current.focus();
      }
    }
  };

  return (
    <div key={todo.id}>
      {editMode ? (
        <div className='todo-edititem-box'>
          <span className='todo-edit-invalid-span'>{editErrorMessage}</span>
          <div className='todoitem-box'>
            <input
              className='todo-edit-input'
              ref={todoEditTextInput}
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <button onClick={handleUpdateClick}>수정 완료</button>
          </div>
        </div>
      ) : (
        <div className='todoitem-box'>
          <p className='todoItem-content'>{todo.description}</p>
          <div className='todo-edit-btn' onClick={handleEditClick}>
            <AiFillEdit size='20'/>
          </div>
          <div className='todo-delete-btn' onClick={() => onDelete(todo.id)}>
            <RiDeleteBin6Line size='20'/>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
