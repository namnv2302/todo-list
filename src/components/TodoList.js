import { useState, useEffect, useRef } from 'react';
import BillingFilledIcon from '@atlaskit/icon/glyph/billing-filled';
import MediaServicesFilterIcon from '@atlaskit/icon/glyph/media-services/filter'
import SearchIcon from '@atlaskit/icon/glyph/search'
import { v4 } from 'uuid';
import TodoItem from './TodoItem';
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';

const cx = classNames.bind(styles);


function TodoList() {
    const isComplete = false;
    
    const [isUpdate, setIsUpdate] = useState(null);

    const [task, setTask] = useState(() => {

        const value = JSON.parse(localStorage.getItem('task'));

        return value || [];
    });
    const [inputValue, setInputValue] = useState('');

    const inputRef = useRef();

    useEffect(() => {
        if(isUpdate) {
            setInputValue(isUpdate.title);
            inputRef.current.focus();
        } else {
            setInputValue('');
        }
    }, [isUpdate])

    const timer = () => {
        const date = new Date();
        const month = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();

        return `${month}/${year}   ${hour}:${minute}:${second}`;
    }

    const handleSubmit = () => {
        if(!isUpdate) {
            setTask(prev => {
                if(inputValue.trim() !== "") {
                    const newTask = [
                        ...prev,
                        {
                            id: v4(),
                            title: inputValue,
                            date: timer(),
                            isComplete: isComplete,
                        }
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
                if(isUpdate.isComplete === true) {
                    isUpdate.isComplete = false
                }
                const newTask = prev.map(item => item.id === isUpdate.id ? {id: isUpdate.id, title: inputValue, date: timer(), isComplete: isUpdate.isComplete} : item);

                localStorage.setItem('task', JSON.stringify(newTask));

                setIsUpdate('');
                setInputValue('');

                return newTask;
            })
        }
    }

    const handleDelete = (id) => {
        setTask(prev => {
            const newTask = prev.filter((item) => item.id !== id);

            localStorage.setItem('task', JSON.stringify(newTask));

            return newTask;
        });
    }

    const handleUpdate = (id) => {
        const itemUpdate = task.find(item => item.id === id);
        setIsUpdate(itemUpdate);
    }

    const handleComplete = (id) => {

        setTask(prev => {
            const newTask = prev.map(item => item.id === id ? {...item, isComplete: !item.isComplete} : item);

            localStorage.setItem('task', JSON.stringify(newTask));

            return newTask;
        })

    }

    const handleSort = () => {
        const newTask = [];
        task.map(item => newTask.unshift(item));
        
        localStorage.setItem('task', JSON.stringify(newTask));
        
        setTask(newTask);
    }
   
    return (     
        <div className={cx('todo-list')}>
            <div className={cx('todo-list-form')}>
                <div className={cx('input')}>
                    <div className={cx('icon')}>
                        <BillingFilledIcon size="large" primaryColor='#16a3b7' label=""  />
                    </div>
                    <input
                        ref={inputRef}
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
                {task.length > 0 && <div className={cx('methods')}>
                    <div className={cx('sort')} onClick={handleSort}>
                        <MediaServicesFilterIcon primaryColor='#16a3b7' />
                    </div>
                    <div className={cx('search')}>
                        <SearchIcon primaryColor='#16a3b7' />
                    </div>
                </div>}
                {task.map((data, index) => (
                    <TodoItem key={index} data={data} onComplete={handleComplete} onUpdate={handleUpdate} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    )
}

export default TodoList;