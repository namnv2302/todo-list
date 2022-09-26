import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import classNames from 'classnames/bind';
import styles from './App.module.scss';

import TodoList from "./components/TodoList";
import Login from "./authen/login/Login.js"
import Register from "./authen/register/Register.js"
import Reset from "./authen/reset/Reset.js"

const cx = classNames.bind(styles);

function App() {
  return (
    <div className={cx('app')}>
      <Router>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/reset' element={<Reset />} />
          <Route path='/todolist' element={<TodoList />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
