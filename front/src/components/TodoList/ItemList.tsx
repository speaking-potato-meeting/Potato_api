import { useState } from 'react';
import './Todo.css';
import { ItemListProps } from '../../types';

export default function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const handleEditClick = (id: number, content: string) => {
    setEditItemId(id);
    setEditedContent(content);
  };

  const handleUpdateClick = (id: number) => {
    if (editedContent.trim() !== '') {
      onUpdate(id, editedContent);
      setEditItemId(null);
    }
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          {editItemId === item.id ? (
            <div className='todoitem-box'>
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <button onClick={() => handleUpdateClick(item.id)}>확인</button>
            </div>
          ) : (
            <div className='todoitem-box'>
              <p className='todoItem-content'>{item.content}</p>
              <button onClick={() => handleEditClick(item.id, item.content)}>수정</button>
              <button onClick={() => onDelete(item.id)}>삭제</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
