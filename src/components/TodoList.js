import { useState, useEffect } from 'react';
import BillingFilledIcon from '@atlaskit/icon/glyph/billing-filled';
import { v4 } from 'uuid';
import TodoItem from './TodoItem';
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';

const cx = classNames.bind(styles);

function TodoList() {
    const [isUpdate, setIsUpdate] = useState(null);

    const [task, setTask] = useState(() => {

        const value = JSON.parse(localStorage.getItem('task'));

        return value || [];
    });
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if(isUpdate) {
            setInputValue(isUpdate.title)
        } else {
            setInputValue('');
        }
    }, [setInputValue, isUpdate])

    const handleSubmit = () => {
        if(!isUpdate) {
            setTask(prev => {
                if(inputValue.trim() != "") {
                    const newTask = [
                        {
                            id: v4(),
                            title: inputValue,
                        },
                        ...prev
                    ];
    
                    localStorage.setItem('task', JSON.stringify(newTask));
    
                    return newTask;
                } else {
                    return prev;
                }
            }); 
            setInputValue('');
        } else {
            setTask(prev => {
                const newTask = prev.map(item => item.id == isUpdate.id ? {id: isUpdate.id, title: inputValue} : item);

                localStorage.setItem('task', JSON.stringify(newTask));

                setIsUpdate('');
                setInputValue('');

                return newTask;
            })
        }
    }

    const handleDelete = (id) => {
        setTask(prev => {
            const newTask = prev.filter((item) => item.id != id);

            localStorage.setItem('task', JSON.stringify(newTask));

            return newTask;
        });
    }

    const handleUpdate = (id) => {
        const itemUpdate = task.find(item => item.id == id);
        setIsUpdate(itemUpdate);
    }
   
    return (
        <div className={cx('todo-list')}>
            <div className={cx('todo-list-form')}>
                <div className={cx('input')}>
                    <div className={cx('icon')}>
                        <BillingFilledIcon size="large" primaryColor='#16a3b7' label=""  />
                    </div>
                    <input
                        type="text" 
                        placeholder='New Todo...'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <div 
                    className={cx('button')}
                    onClick={handleSubmit}
                >
                    {isUpdate ? 'Change' : 'Add new task'}
                </div>
            </div>
            <div className={cx('wrapper')}>
                {task.map((data, index) => (
                    <TodoItem key={index} data={data} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    )
}

export default TodoList;