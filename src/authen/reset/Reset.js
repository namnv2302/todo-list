import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { sendPasswordReset } from '../functions.js';
import styles from './Reset.module.scss';

const cx = classNames.bind(styles);

function Reset() {
    const [email, setEmail] = useState('');

    // useEffect(() => {
    //     if(loading) return;
    //     if(user) return navigate('/todolist');

    // }, [user, loading])

    const resetPassword = () => {
        if(email) {
            sendPasswordReset(email);
            setEmail('');
        }
    }

    return ( 
        <div className={cx('reset')}>
            <div className={cx('container')}>
                <h3>Reset password</h3>
                <div className={cx('input-item')}>
                    <label htmlFor='email'>Email address</label>
                    <input 
                        id='email'
                        type='text'
                        placeholder='Enter email'
                        autoComplete='off'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <button className={cx('button')}
                        onClick={resetPassword}
                    >
                        Reset
                    </button>
                </div>
                <div className={cx('wrap')}>
                    <div className={cx('left')}>
                        <div className={cx('register')}>
                            Don't have an account <Link to='/register'>Register</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Reset;