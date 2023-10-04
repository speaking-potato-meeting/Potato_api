import { useState } from 'react'
import './Todo.css';
import { EditorProps } from '../../types';

export default function Editor ({ onAdd } : EditorProps) {
  const [text, setText] = useState('');

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onClickButton = () => {
    onAdd(text); // 받은 text를 추가해주는 코드
    setText('');
  }

  return (
    <div className='todo-add-box'>
      <input 
        className='todo-add-input'
        value={text}
        onChange={onChangeInput}  
      />
      <button onClick={onClickButton}>추가</button>
    </div>
  )
}
