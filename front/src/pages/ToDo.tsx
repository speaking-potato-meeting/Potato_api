import { useEffect, useState } from 'react';
import '../App.css';
import Editor from '../components/TodoList/Editor';
import ItemList from '../components/TodoList/ItemList';
import { Todo } from '../types';
import axios from 'axios';

function App() {
  const [todolist, setTodolist] = useState<Todo[]>([]);

  // 데이터를 서버에서 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/todolist/2'); // 백엔드의 API 엔드포인트를 설정하세요
      const todoData = response.data;
      setTodolist(todoData);
    } catch (error) {
      console.error('todo 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // // 기존 비동기 코드 대체
  // useEffect(() => {
  //   fetchData();
  // }, []);

  const onAdd = (text: string) => {
    try {
      axios.post('http://127.0.0.1:8000/api/todolist/', {
        user_id: 1,
        title: text,
        description: text,
        is_active: false,
      });
    } catch (error) {
      console.log('todo 생성 중에 오류가 발생했습니다. :', error)
    }
  }

  const onUpdate = (id: number, newContent: string) => {
    setTodolist(prevState =>
      prevState.map(todo => (todo.id === id ? { ...todo, content: newContent } : todo))
    );
  };

  const onDelete = (id: number) => {
    setTodolist(prevState => prevState.filter(todo => todo.id !== id));
  }

  return (
    <div className='todo-box'>
      <h1>할 일을 하자</h1>
      <Editor onAdd={onAdd} />
      <ItemList items={todolist} onDelete={onDelete} onUpdate={onUpdate}/>
    </div>
  )
}

export default App;
