import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditFilledIcon from '@atlaskit/icon/glyph/edit-filled'
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';


const cx = classNames.bind(styles);

function TodoItem({ id, value, onClick }) {
    return ( 
        <div className={cx('todo-item')}>
            <p className={cx('title')}>{value}</p>
            <div className={cx('options')}>
                <span className={cx('icon-change')}>
                    <EditFilledIcon primaryColor='#fec104' />
                </span>
                <span className={cx('icon-delete')} onClick={() => onClick(id)}>
                    <TrashIcon primaryColor='#db3445' />
                </span>
            </div>
        </div>
     );
}

export default TodoItem;