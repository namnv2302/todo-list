import classNames from 'classnames/bind';
import styles from './App.module.scss';

import TodoList from "./components/TodoList";

const cx = classNames.bind(styles);

function App() {
  return (
    <div className={cx('app')}>
      <h3>Todo List</h3>
      <div className={cx('content')}>
        <TodoList />
      </div>
    </div>
  )
}

export default App;
