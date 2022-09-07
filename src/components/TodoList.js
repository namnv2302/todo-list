import { useState } from 'react';
import BillingFilledIcon from '@atlaskit/icon/glyph/billing-filled';
import TodoItem from './TodoItem';
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';

const cx = classNames.bind(styles);

function TodoList() {

    const [task, setTask] = useState(() => {

        const value = JSON.parse(localStorage.getItem('task'));

        return value || [];
    });
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        setTask(prev => {
            if(inputValue.trim() != "") {
                const newTask = [inputValue, ...prev];

                localStorage.setItem('task', JSON.stringify(newTask));

                return newTask;
            } else {
                return prev;
            }
        }); 
        setInputValue('');
    }

    const handleDelete = (id) => {
        setTask(prev => {
            const newTask = prev.filter((item, index) => index != id);

            localStorage.setItem('task', JSON.stringify(newTask));

            return newTask;
        });
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
                    Add new task
                </div>
            </div>
            <div className={cx('wrapper')}>
                {task.map((item, index) => (
                    <TodoItem key={index} id={index} value={item} onClick={handleDelete} />
                ))}
            </div>
        </div>
    )
}

export default TodoList;