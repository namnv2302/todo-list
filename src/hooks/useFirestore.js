import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, where } from 'firebase/firestore'
import { db } from '../storage/firebase'

function useFirestore(nameCollection, condition) {
    const [value, setValue] = useState([])

    useEffect(() => {
        var q = query(collection(db, nameCollection));
        if(condition.compareValue) {
            q = query(q, where(condition.fieldName, condition.operator, condition.compareValue))
        }
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push(doc.data());
        });
        setValue(documents)
        });

        return unsubscribe
    }, [nameCollection, condition])

    return value
}

export default useFirestore;