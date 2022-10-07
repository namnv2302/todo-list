import { useState, useEffect, useRef, useContext } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip } from 'antd';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore"; 
import { useAuthState } from "react-firebase-hooks/auth";
import BillingFilledIcon from '@atlaskit/icon/glyph/billing-filled';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { auth, db } from '../storage/firebase.js';
import TodoItem from './TodoItem';
import classNames from 'classnames/bind';
import styles from './TodoList.module.scss';
import Sidebar from './Sidebar/Sidebar.js';
import addDocument from '../services/addDocument.js';
import { GroupsContext } from '../services/GroupsProvider';
import InviteMemberModal from '../services/InviteMember';

const cx = classNames.bind(styles);

function TodoList({ direction, ...args }) {
    const isComplete = false;
    const { members, setChooseGroup, chooseGroup, groupChoosed, inviteMember, setInviteMember } = useContext(GroupsContext);

    const [updateItem, setUpdateItem] = useState();
    const [level, setLevel] = useState('hight');
    const [searchValue, setSearchValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpenFilter, setDropdownOpenFilter] = useState(false);
    
    // Lấy dữ liệu từ localStorage -> set cho mảng Task
    const [tasks, setTasks] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();
    const searchRef = useRef();

    // Lấy thông tin user
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    // Xử lý sửa các task
    useEffect(() => {
        if(updateItem) {
            setInputValue(updateItem.title);
            setLevel(updateItem.level);
            inputRef.current.focus();
        } else {
            setInputValue('');
        }
    }, [updateItem])

    // Lấy dữ liệu từ firebase store
    const fetchData = async () => {
        try {
            const tasks = [];
            const q = query(collection(db, "todo-items"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                tasks.push(doc.data())
            });
            setTasks(tasks)
            
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        const q = query(collection(db, 'todo-items-group'), where('idGroup', '==', `${groupChoosed.id}`))
        const unsub = onSnapshot(q, (snapshot) => {
            setTasks(snapshot.docs.map(doc => doc.data()))
        })
        return unsub
    }, [groupChoosed.id])

    useEffect(() => {
        if(loading) return;
        if(!user) return navigate('/login')

        if(chooseGroup === '') {
            fetchData()
        } else {
            const q = query(collection(db, 'todo-items-group'), where('idGroup', '==', `${groupChoosed.id}`))
            const unsub = onSnapshot(q, (snapshot) => {
                setTasks(snapshot.docs.map(doc => doc.data()))
            })
            return unsub
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading, groupChoosed.id])

    const AddZero = (num) => {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }

    const timer = () => {
        var now = new Date();
        var strDateTime = [[AddZero(now.getDate()), 
            AddZero(now.getMonth() + 1), 
            now.getFullYear()].join("/"), 
            [AddZero(now.getHours()), 
            AddZero(now.getMinutes()),
            AddZero(now.getSeconds() + 1)].join(":"), 
            now.getHours() >= 12 ? "PM" : "AM"].join(" ");

        var sec = now.getTime() / 1000;
        sec = Math.floor(sec)
        return [strDateTime, sec];
    }


    // Xử lý khi click nút tạo task 
    const handleSubmit = () => {
        if(!updateItem) {
            if(inputValue.trim() !== "") {
                const item = {
                    uid: user.uid,
                    id: v4(),
                    title: inputValue,
                    date: timer(),
                    isComplete: isComplete,
                    level: level,
                }
                
                if(chooseGroup) {
                    setTasks(prev => [...prev, {...item, idGroup: groupChoosed.id}])
                    addDocument(`todo-items-group`, {...item, idGroup: groupChoosed.id});
                } else {
                    setTasks(prev => [...prev, item])
                    addDocument('todo-items', item);
                }
            }
            setInputValue('');
            inputRef.current.focus();
        } else {
            setTasks(prev => {
                if(updateItem.isComplete === true) {
                    updateItem.isComplete = false
                }

                const item = chooseGroup ? doc(db, "todo-items-group", `${updateItem.id}`) : doc(db, "todo-items", `${updateItem.id}`);
                updateDoc(item, {
                    id: updateItem.id, 
                    title: inputValue, 
                    date: timer(), 
                    isComplete: updateItem.isComplete,
                    level: level
                });

                const newTask = prev.map(item => item.id === updateItem.id 
                    ? 
                    {id: updateItem.id, 
                    title: inputValue, 
                    date: timer(), 
                    isComplete: updateItem.isComplete,
                    level: level
                } 
                    :
                    item);

                setUpdateItem('');
                setInputValue('');
    
                return newTask;
            })
        }
    }

    // Xử lý khi xóa task 
    const handleDelete = async (id) => {
        if(chooseGroup === '') {
            await deleteDoc(doc(db, "todo-items", `${id}`));
        } else {
            await deleteDoc(doc(db, "todo-items-group", `${id}`));
        }
        setTasks(prev => {
            const newTask = prev.filter((item) => item.id !== id);

            return newTask;
        });
    }

    // Xử lý sửa task
    const handleUpdate = (id) => {
        const itemUpdate = tasks.find(item => item.id === id);
        setUpdateItem(itemUpdate);
    }

    // Xử lý khi click checkbox hoàn thành task 
    const handleComplete = (id) => {
        setTasks(prev => {
            const newTask = prev.map(item => item.id === id ? {...item, isComplete: !item.isComplete} : item);
            const itemFind = prev.find(item => item.id === id);

            const item = chooseGroup ? doc(db, "todo-items-group", id) : doc(db, "todo-items", id);
            updateDoc(item, {
                isComplete: !itemFind.isComplete
            });

            return newTask;
        })
    }

    // Xử lý khi search
    const handleSearch = () => {
        if(searchValue.trim() !== '') {
            const searchTask = tasks.filter(item => item.title.includes(searchValue))
            searchRef.current.focus();
            setSearchValue('');

            if(searchTask.length > 0) {
                setTasks(searchTask)
            } else {
                if(chooseGroup === '') {
                    fetchData()
                } else {
                    setChooseGroup(groupChoosed.id)
                }
            }
            
        } else {
            if(chooseGroup === '') {
                fetchData()
            } else {
                setChooseGroup(groupChoosed.id)
            }
        }
    }

    // Xử lý khi chọn các mức level 
    const handleChooseLevel = (e) => {
        const value = e.target.value;
        
        if(value) {
            setLevel(value);
        }
    }

    // Xử lý sắp xếp theo thời gian tạo và mức độ ưu tiên
    const handleSort = (id) => {
        let newTask;
        if(id === 1) {
            newTask = []
            var arraySecDown = tasks.map(item => item.date[1])
            arraySecDown.sort(function(a, b){return b - a})
            arraySecDown.forEach(arrayItem => (
                newTask.push(tasks.find(item => item.date[1] === arrayItem))
            ))
        }
        if(id === 2) {
            newTask = []
            var arraySec = tasks.map(item => item.date[1])
            arraySec.sort(function(a, b){return a - b})
            arraySec.forEach(arrayItem => (
                newTask.push(tasks.find(item => item.date[1] === arrayItem))
            ))
        }
        if(id === 3) {
            newTask = [
                ...tasks.filter(item => item.level === 'low'), 
                ...tasks.filter(item => item.level === 'medium'),
                ...tasks.filter(item => item.level === 'hight')
            ]
        }
        if(id === 4) {
            newTask = [
                ...tasks.filter(item => item.level === 'hight'), 
                ...tasks.filter(item => item.level === 'medium'),
                ...tasks.filter(item => item.level === 'low')
            ]
        }
        setTasks(newTask);
    }

    const handleFilter = (id) => {
        let filterTasks = [];
        const q = chooseGroup ? query(collection(db, "todo-items-group"), where("uid", "==", user.uid)) : query(collection(db, "todo-items"), where("uid", "==", user.uid));
        getDocs(q)
            .then((querySnapshot) => {
                const items = [];
                querySnapshot.forEach((doc) => items.push(doc.data()));
                // setTasks(items)
                if(id === 1) {
                    filterTasks = items.filter(item => item.level === 'hight')
                    setTasks(filterTasks)
                }
                if(id === 2) {
                    filterTasks = items.filter(item => item.level === 'medium')
                    setTasks(filterTasks)
                }
                if(id === 3) {
                    filterTasks = items.filter(item => item.level === 'low')
                    setTasks(filterTasks)
                }
                if(id === 4) {
                    setTasks(items)
                }
            })
    }
    
    const toggle = () => {
        return setDropdownOpen((prevState) => !prevState);
    }

    const toggleFilter = () => {
        return setDropdownOpenFilter((prevState) => !prevState);
    }
    
    const handleDeleteMember = (uid) => {
        if(uid !== user.uid && groupChoosed.isGroupBoss === user.uid) {
            const item = doc(db, "groups", groupChoosed.id);
            updateDoc(item, {
                members: groupChoosed.members.filter(member => member !== uid)
            });
        }
    };

    return (
        <div className={cx('wrap')}>
            <Sidebar />
            
            <div className={cx('body')}>
                {chooseGroup && <>
                    <div className={cx('name-group')}>{groupChoosed.title}</div>
                    <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {members.map((member, index) => (
                            <Tooltip key={index} onClick={() => handleDeleteMember(member.uid)} title={member.displayName || 'No name'} placement="top">
                                <Avatar src={member.photoURL} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                    <Button onClick={() => setInviteMember(true)}>Add member</Button>
                </>}

                <h3 className={cx('heading')}>Todo List</h3>
                <div className={cx('content')}>
                    <div className={cx('todo-list')}>
                        <div className={cx('todo-list-form')}>
                            <div className={cx('wrapper-input')}>
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
                                <select className={cx('level-option')} value={level} id="level" onChange={handleChooseLevel}>
                                    <option value="hight">Hight</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div         
                                className={cx('button')}
                                onClick={handleSubmit}
                            >
                                {updateItem ? 'Change' : 'Add new task'}
                            </div>
                        </div>
                        <div className={cx('wrapper')}>
                            {tasks.length > 0 && <div className={cx('methods')}>
                                <div className={cx('sort-filter')}>
                                <div className={cx('sort')}>
                                    <Dropdown offset="true" isOpen={dropdownOpen} toggle={toggle} direction={direction}>
                                        <DropdownToggle color='secondary' caret>Sort</DropdownToggle>
                                        <DropdownMenu style={{ margin: 0 }}>
                                            <DropdownItem header disabled>Sort time</DropdownItem>
                                            <DropdownItem onClick={() => handleSort(1)}>Lastest</DropdownItem>
                                            <DropdownItem onClick={() => handleSort(2)}>Earliest</DropdownItem>
                                            <DropdownItem header disabled>Sort level</DropdownItem>
                                            <DropdownItem onClick={() => handleSort(3)}>Low-Hight</DropdownItem>
                                            <DropdownItem onClick={() => handleSort(4)}>Hight-Low</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className={cx('filter')}>
                                    <Dropdown offset="true" isOpen={dropdownOpenFilter} toggle={toggleFilter} direction={direction}>
                                        <DropdownToggle color='secondary' caret>Filter</DropdownToggle>
                                        <DropdownMenu style={{ margin: 0 }}>
                                            <DropdownItem onClick={() => handleFilter(1)}>Hight</DropdownItem>
                                            <DropdownItem onClick={() => handleFilter(2)}>Medium</DropdownItem>
                                            <DropdownItem onClick={() => handleFilter(3)}>Low</DropdownItem>
                                            <DropdownItem active onClick={() => handleFilter(4)}>Clear</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                </div>
                                <div className={cx('search-input')}>
                                    <input 
                                        ref={searchRef}
                                        type='text'
                                        placeholder='Search...' 
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    <button className={cx('button-search')} onClick={handleSearch}>Search</button>
                                </div>
                            </div>}
                            {
                                tasks.length > 0 
                                ?
                                tasks.map((data, index) => (
                                    <TodoItem key={index} tasks={tasks} data={data} onComplete={handleComplete} onUpdate={handleUpdate} onDelete={handleDelete} />
                                )) 
                                : 
                                <h1 className={cx('result')}>Không có nội dung!</h1>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {inviteMember && <InviteMemberModal />}
        </div>
    )
}

export default TodoList;