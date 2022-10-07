import { useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Login.module.scss';
import { logInWithEmailAndPassword, signInWithGoogle, signInWithFacebook } from "../functions.js";

const cx = classNames.bind(styles);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return ( 
        <div className={cx('login')}>
            <div className={cx('container')}>
                <h3>Sign In</h3>
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
                        
                        onClick={() => logInWithEmailAndPassword(email, password)}
                    >
                        Login
                    </button>
                </div>
                <div className={cx('wrap')}>
                    <div className={cx('left')}>
                        <div className={cx('register')}>
                            Don't have an account <Link to='/register'>Register</Link>
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

export default Login;