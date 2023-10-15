import React, { useRef, useState } from 'react';
import { TodoFormProps } from '../../types';
import './Todo.css';
import '../../App.css'

const TodoForm = ({ onAdd }: TodoFormProps ) => {
  const [text, setText] = useState('');
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const todoTextInput = useRef<HTMLInputElement>(null); // todoTextInput Ref 객체

  const onChangeInput = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setText(e.target.value);
  };

  const handleAddPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      onClickAdd();
    }
  };

  const onClickAdd = () => {
    if (text.trim() !== '') {
      setAddErrorMessage("");
      onAdd(text); // 받은 text를 추가해주는 코드
      setText('');
    } else {
      setAddErrorMessage("내용을 입력해주세요!");
      if (todoTextInput.current) {
        todoTextInput.current.focus();
      }
    }
  }

  return (
    <div>
      <span className='todo-add-invalid-span'>{addErrorMessage}</span>
      <div className='todo-add-editor'>
        <input 
          className='todo-add-input'
          ref={todoTextInput}
          value={text}
          onChange={onChangeInput}  
          onKeyPress={handleAddPress}
        />
        <button onClick={onClickAdd}>추가</button>
      </div>
    </div>
  );
};

export default TodoForm;
