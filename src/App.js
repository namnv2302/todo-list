import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./App.module.scss";
import AuthProvider from "./services/AuthProvider";
import GroupsProvider from "./services/GroupsProvider";

import TodoList from "./components/TodoList";
import Login from "./authen/login/Login.js";
import Register from "./authen/register/Register.js";
import Reset from "./authen/reset/Reset.js";

const cx = classNames.bind(styles);

function App() {
  return (
    <div className={cx("app")}>
      <Router basename="todo-app">
        <AuthProvider>
          <GroupsProvider>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<TodoList />} />
            </Routes>
          </GroupsProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
