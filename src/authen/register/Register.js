import { useState, useEffect } from "react";
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'
import styles from './Register.module.scss';
import { auth } from '../../storage/firebase.js'
import { registerWithEmailAndPassword, signInWithGoogle, signInWithFacebook } from '../functions.js';

const cx = classNames.bind(styles);

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(loading) return;
        if(user) return navigate('/');
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading])

    return ( 
        <div className={cx('register')}>
            <div className={cx('container')}>
                <h3>Register</h3>
                <div className={cx('input-item')}>
                    <label htmlFor='email'>Email address</label>
                    <input 
                        id='email'
                        type='email'
                        placeholder='Enter email'
                        autoComplete='off'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={cx('input-item')}>
                    <label htmlFor='password'>Password</label>
                    <input 
                        id='password'
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button className={cx('button')}
                        
                        onClick={() => registerWithEmailAndPassword(email, password)}
                    >
                        Register
                    </button>
                </div>
                <div className={cx('wrap')}>
                    <div className={cx('left')}>
                        <div className={cx('login')}>
                            Already have an account? <Link to='/'>Login</Link>
                        </div>
                        <div className={cx('sign-up-with')}>
                            <div className={cx('google')} onClick={signInWithGoogle}>
                                <img src="https://img-cache.coccoc.com/image2?i=2&l=19/237768940" alt="" />
                            </div>
                            <div className={cx('facebook')} onClick={signInWithFacebook}>
                                <img src="https://img-cache.coccoc.com/image2?i=2&l=50/784792063" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className={cx('reset')}>
                        <Link to="/reset">Forgot password?</Link>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Register;