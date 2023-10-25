import { useEffect, useState } from 'react';
import '../App.css';
import '../components/TodoList/Todo.css'
import { Todo } from '../types';
import TodoForm from '../components/TodoList/TodoForm';
import TodoItem from '../components/TodoList/TodoItem';
import axios from 'axios';
import { useCurrentUserContext } from "../context/CurrentUserContextProvider";

function ToDo() {
  const [todolist, setTodolist] = useState<Todo[]>([]);
  const [todoUserId, setTodoUserId] = useState(0);

  const currentUser = useCurrentUserContext();

  // 무한루프 방지를 위해 조건문
  if (currentUser && currentUser.id !== todoUserId) {
    const user_id = currentUser.id;
    setTodoUserId(user_id);
  }

  // 데이터를 서버에서 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/todolist/${todoUserId}`, {
        withCredentials: true,
      });
      const todoData = response.data;
      setTodolist(todoData);
    } catch (error) {
      console.error('todo 데이터를 가져오는 중 오류 발생했습니다.', error);
    }
  };

  // 기존 비동기 코드 대체
  useEffect(() => {
    fetchData();
  }, []);

  const onAdd = async (description: string) => {
    try {
      const response = await axios.post('http://localhost:8000/api/todolist/', 
        { user_id: todoUserId, description: description, is_active: false },
        { withCredentials: true }
      );
      const newTodolist = {
        id: response.data.id,
        user_id: response.data.user_id,
        description: response.data.description,
        is_active: response.data.is_active,
      };
      setTodolist([...todolist, newTodolist])
    } catch (error) {
      console.log('todo 생성 중에 오류가 발생했습니다. :', error)
    }
  }

  const onDescriptionUpdate = async (id: number, newDescription: string) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/todolist/todo/${id}`, {
        description: newDescription,
        is_active: false,
      },
      { withCredentials: true });
      const updatedTodo = todolist.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            id: response.data.id,
            user_id: response.data.id,
            description: response.data.description,
            is_active: response.data.is_active
          };
        }
        return todo;
      });
      setTodolist(updatedTodo);
    } catch (error) {
      console.log('todo 내용 수정 중에 오류가 발생했습니다. :', error)
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/todolist/todo/${id}`,
      { withCredentials: true }
      );
      const updatedTodo = todolist.filter((todo) => todo.id !== id);
      setTodolist(updatedTodo);
    } catch (error) {
      console.log('todo item 삭제 중에 오류가 발생했습니다. : ', error)
    }
  }


  const handleCheckboxChange = async (id: number, is_active: boolean, description: string) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/todolist/todo/${id}`, {
        description: description,
        is_active: !is_active,
      },
      { withCredentials: true });
      const updatedTodo = todolist.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            id: response.data.id,
            user_id: response.data.id,
            description: response.data.description,
            is_active: response.data.is_active
          };
        }
        return todo;
      });
      setTodolist(updatedTodo);
    } catch (error) {
      console.log('todo is_active 수정 중에 오류가 발생했습니다. :', error)
    }
  }

  return (
    <div className='todo'>
      <h1>할 일을 하자</h1>
      <TodoForm onAdd={onAdd}/>
      <div>
        {todolist.map((todo) => (
          <div className='todo-box'>
            <input className='todoItem-checkbox' type="checkbox" checked={todo.is_active} onChange={() => handleCheckboxChange(todo.id, todo.is_active, todo.description)} />
            <TodoItem key={todo.id} todo={todo} onDescriptionUpdate={onDescriptionUpdate} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToDo;