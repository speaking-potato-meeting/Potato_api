import { useRef, useEffect, useState } from 'react';
import '../App.css';
import Editor from '../components/TodoList/Editor';
import ItemList from '../components/TodoList/ItemList';
import { Todo } from '../types';

function App() {
  const [todolist, setTodolist] = useState<Todo[]>([]);
  const idRef = useRef(1);

  const onAdd = (text: string) => {
    setTodolist(prevState => [
      ...prevState,
      {
        id: idRef.current++,
        content: text,
      }
    ]);
  }

  const onUpdate = (id: number, newContent: string) => {
    setTodolist(prevState =>
      prevState.map(todo => (todo.id === id ? { ...todo, content: newContent } : todo))
    );
  };

  const onDelete = (id: number) => {
    setTodolist(prevState => prevState.filter(todo => todo.id !== id));
  }

  useEffect(() => {
    console.log(todolist);
  }, [todolist]);

  return (
    <>
      <h1>Todo</h1>
      <Editor onAdd={onAdd} />
      <ItemList items={todolist} onDelete={onDelete} onUpdate={onUpdate}/>
    </>
  )
}

export default App;
