import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'
import { sendPasswordReset } from '../functions.js';
import styles from './Reset.module.scss';
import { auth } from '../../storage/firebase.js'

const cx = classNames.bind(styles);

function Reset() {
    const [email, setEmail] = useState('');
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(loading) return;
        if(user) return navigate('/');
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading])

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