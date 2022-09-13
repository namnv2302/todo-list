import { useEffect, useLayoutEffect, useState } from 'react';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
// import CheckIcon from '@atlaskit/icon/glyph/check'
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';


const cx = classNames.bind(styles);
const levels = ['hight', 'medium', 'low'];

function TodoItem({ data, onComplete, onUpdate, onDelete }) {
    const [editLevel, setEditLevel] = useState(false)

    const newLevels = levels.filter(level => level !== data.level);

    const classes = cx('level', {
        [data.level]: data.level
    })

    const handleEditLevel = (e) => {
        data.level = e.target.value;
        setEditLevel(!editLevel);
    }
    
    return ( 
        <div className={cx('todo-item')}>
            <div className={cx('text')}>
                <p className={data.isComplete ? cx('title', 'complete') : cx('title')}>{data.title}</p>
                <p className={cx('date')}>{data.date[0]}</p>
            </div>
            <div className={cx('options')}>
                {editLevel 
                    ?
                    <select onChange={handleEditLevel} className={cx('select-level', {[data.level]: data.level})}>
                        <option value={data.level}>{data.level}</option>
                        <option value={newLevels[0]}>{newLevels[0]}</option>
                        <option value={newLevels[1]}>{newLevels[1]}</option>
                    </select>
                    : 
                    <span className={classes} onClick={() => setEditLevel(!editLevel)}>{data.level}</span>}
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