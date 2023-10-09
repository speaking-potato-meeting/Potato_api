import { useEffect, useState } from 'react';
import '../App.css';
import '../components/TodoList/Todo.css'
import { Todo, User } from '../types';
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiFillEdit } from 'react-icons/ai';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'
import { useCurrentUserContext } from "../context/CurrentUserContextProvider";


function ToDo() {
  const [todolist, setTodolist] = useState<Todo[]>([]);
  const [todoUserId, setTodoUserId] = useState(0);

  // 기존 방식에서 user 정보 받아왔던 것
  // const { currentUser } = useCurrentUserContext()
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

  const onUpdate = async (id: number, newDescription: string) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/todolist/${id}`, {
        user_id: todoUserId,
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
      console.log('todo 수정 중에 오류가 발생했습니다. :', error)
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/todolist/${id}`, { withCredentials: true });
      const updatedTodo = todolist.filter((todo) => todo.id !== id);
      setTodolist(updatedTodo);
    } catch (error) {
      console.log('todo item 삭제 중에 오류가 발생했습니다. : ', error)
    }
  }

  const [text, setText] = useState('');

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onClickAdd = () => {
    onAdd(text); // 받은 text를 추가해주는 코드
    setText('');
  }

  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const handleEditClick = (id: number, description: string) => {
    setEditItemId(id);
    setEditedContent(description);
  };

  const handleUpdateClick = (id: number) => {
    if (editedContent.trim() !== '') {
      onUpdate(id, editedContent);
      setEditItemId(null);
    }
  };

  return (
    <div className='todo-box'>
      <h1>할 일을 하자</h1>
      <div className='todo-add-box'>
        <input 
          className='todo-add-input'
          value={text}
          onChange={onChangeInput}  
        />
        <button onClick={onClickAdd}>추가</button>
      </div>
      <div className=''>
          {todolist.map((todo)=>(
            <div key={todo.id}>
            {editItemId === todo.id ? (
              <div className='todoitem-box'>
                <input
                  className='todo-edit-input'
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => handleUpdateClick(todo.id)}>수정 완료</button>
              </div>
            ) : (
              <div className='todoitem-box'>
                <p className='todoItem-content'>{todo.description}</p>
                <div className='todo-edit-btn' onClick={() => handleEditClick(todo.id, todo.description)}>
                  <AiFillEdit size='20'/>
                </div>
                <div className='todo-delete-btn' onClick={() => onDelete(todo.id)}>
                  <RiDeleteBin6Line size='20'/>
                </div>
              </div>
            )}
          </div>
          ))}
      </div>
    </div>
  )
}

export default ToDo;