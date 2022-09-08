import { useRef, useState } from 'react';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
// import CheckIcon from '@atlaskit/icon/glyph/check'
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';


const cx = classNames.bind(styles);

function TodoItem({ data, onComplete, onUpdate, onDelete }) {
    
    return ( 
        <div className={cx('todo-item')}>
            <p className={cx('text')}>
                <p className={data.isComplete ? cx('title', 'complete') : cx('title')}>{data.title}</p>
                <p className={cx('date')}>{data.date}</p>
            </p>
            <div className={cx('options')}>
                <span className={cx('icon-checkbox')}>
                    <input checked={data.isComplete} onChange={() => onComplete(data.id)} type="checkbox"/>
                </span>
                <span className={cx('icon-change')} onClick={() => onUpdate(data.id)}>
                    <EditFilledIcon primaryColor='#fec104' />
                </span>
                <span className={cx('icon-delete')} onClick={() => onDelete(data.id)}>
                    <TrashIcon primaryColor='#db3445' />
                </span>
            </div>
        </div>
     );
}

export default TodoItem;