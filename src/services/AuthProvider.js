import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../storage/firebase';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscibed = onAuthStateChanged(auth, (user) => {
            if(user) {
                const { displayName, email, uid, photoURL } = user;
                setUser({ displayName, email, uid, photoURL });
                navigate('/');
            } else {
                navigate('/login');
            }
        })

        return () => unsubscibed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return ( 
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
     );
}

export default AuthProvider;